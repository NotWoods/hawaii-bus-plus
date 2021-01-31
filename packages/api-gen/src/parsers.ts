import type {
  Agency,
  Calendar,
  CsvAgency,
  CsvCalendar,
  CsvCalendarDates,
  CsvRoute,
  CsvShape,
  CsvStop,
  CsvStopTime,
  CsvTransfer,
  CsvTrip,
  FeedInfo,
  GTFSData,
  Route,
  Shape,
  Stop,
  StopTime,
  TimeString,
  Transfer,
  Trip,
} from '@hawaii-bus-plus/types';
import { first, toArray } from 'ix/asynciterable';
import { DateString } from '@hawaii-bus-plus/types';
import mnemonist from 'mnemonist';
import type { Mutable } from 'type-fest';
import { compareAs } from '@hawaii-bus-plus/utils';

const { MultiMap, DefaultMap } = mnemonist;

export type JsonStreams = {
  routes: AsyncIterable<CsvRoute>;
  trips: AsyncIterable<CsvTrip>;
  stops: AsyncIterable<CsvStop>;
  calendar: AsyncIterable<CsvCalendar>;
  calendar_dates: AsyncIterable<CsvCalendarDates>;
  stop_times: AsyncIterable<CsvStopTime>;
  feed_info: AsyncIterable<FeedInfo>;
  transfers: AsyncIterable<CsvTransfer>;
  agency: AsyncIterable<CsvAgency>;
  shapes: AsyncIterable<CsvShape>;
};

function fixTimeString(time: string) {
  return time.padStart('00:00:00'.length, '0') as TimeString;
}

export async function parseFeedInfo(
  json: Pick<JsonStreams, 'feed_info'>,
  variable: Pick<GTFSData, 'info'>
) {
  const info = await first(json.feed_info);
  variable.info = info!;
}

export async function parseAgency(
  json: Pick<JsonStreams, 'agency'>,
  variable: Pick<GTFSData, 'agency'>
) {
  for await (const csvAgency of json.agency) {
    variable.agency[csvAgency.agency_id] = csvAgency;
  }

  const agencies = Object.keys(variable.agency) as Agency['agency_id'][];
  return agencies[0];
}

export async function parseRoutes(
  json: Pick<JsonStreams, 'routes'>,
  variable: Pick<GTFSData, 'routes'>,
  defaultAgency: Agency['agency_id']
) {
  const routes = (await toArray(json.routes)).sort(
    compareAs((route) => route.route_sort_order)
  );
  for (const csvRoute of routes) {
    const route = csvRoute as Mutable<Route>;
    route.agency_id ||= defaultAgency;
    variable.routes[route.route_id] = route;
  }
}

export async function parseTrips(
  json: Pick<JsonStreams, 'trips'>,
  variable: Pick<GTFSData, 'trips'>
) {
  const trips = new Map<Trip['trip_id'], Trip>();
  for await (const csvTrip of json.trips) {
    const trip = csvTrip as Mutable<Trip>;
    trip.stop_times = [];
    variable.trips.push(trip);
    trips.set(trip.trip_id, trip);
  }
  return trips;
}

export async function parseStops(
  json: Pick<JsonStreams, 'transfers' | 'stops'>,
  variable: Pick<GTFSData, 'stops'>
) {
  const transfers = new MultiMap<Stop['stop_id'], Transfer>();
  for await (const csvTransfer of json.transfers) {
    if (csvTransfer.transfer_type !== 3) {
      transfers.set(csvTransfer.from_stop_id, csvTransfer);
    }
  }

  for await (const csvStop of json.stops) {
    const stop: Stop = {
      stop_id: csvStop.stop_id,
      stop_name: csvStop.stop_name,
      stop_desc: csvStop.stop_desc,
      position: {
        lat: csvStop.stop_lat,
        lng: csvStop.stop_lon,
      },
      routes: [],
      transfers: transfers.get(csvStop.stop_id) || [],
    };
    variable.stops[stop.stop_id] = stop;
  }
}

export async function parseCalendar(
  json: Pick<JsonStreams, 'calendar' | 'calendar_dates'>,
  variable: Pick<GTFSData, 'calendar'>
) {
  const calendarDates = new MultiMap<
    Calendar['service_id'],
    CsvCalendarDates
  >();
  for await (const csvCalendarDate of json.calendar_dates) {
    calendarDates.set(csvCalendarDate.service_id, csvCalendarDate);
  }

  for await (const csvCalendar of json.calendar) {
    const days: Calendar['days'] = [
      csvCalendar.monday,
      csvCalendar.tuesday,
      csvCalendar.wednesday,
      csvCalendar.thursday,
      csvCalendar.friday,
      csvCalendar.saturday,
      csvCalendar.sunday,
    ];
    const added_dates: DateString[] = [];
    const removed_dates: DateString[] = [];
    for (const dates of calendarDates.get(csvCalendar.service_id) || []) {
      switch (dates.exception_type) {
        case 1:
          added_dates.push(dates.date);
          break;
        case 2:
          removed_dates.push(dates.date);
          break;
      }
    }
    const calendar: Calendar = {
      service_id: csvCalendar.service_id,
      service_name: csvCalendar.service_name,
      start_date: csvCalendar.start_date,
      end_date: csvCalendar.end_date,
      days,
      added_dates,
      removed_dates,
    };
    variable.calendar[calendar.service_id] = calendar;
  }
}

export async function parseStopTimes(
  json: Pick<JsonStreams, 'stop_times'>,
  variable: Pick<GTFSData, 'routes' | 'stops'>,
  trips: ReadonlyMap<Trip['trip_id'], Trip>
) {
  for await (const csvStopTime of json.stop_times) {
    const stopTime = (csvStopTime as unknown) as Mutable<StopTime>;
    delete (csvStopTime as Partial<CsvStopTime>).continuous_drop_off;
    delete (csvStopTime as Partial<CsvStopTime>).drop_off_type;
    stopTime.arrival_time = fixTimeString(stopTime.arrival_time);
    stopTime.departure_time = fixTimeString(stopTime.departure_time);

    const stop = variable.stops[stopTime.stop_id];
    const trip = trips.get(csvStopTime.trip_id)!;
    const route = variable.routes[trip.route_id];

    trip.stop_times.push(stopTime);

    if (!stop.routes.includes(route.route_id)) {
      stop.routes.push(route.route_id);
    }
  }
}

export async function parseShapes(json: Pick<JsonStreams, 'shapes'>) {
  const shapes = new DefaultMap<Shape['shape_id'], Shape>((shape_id) => ({
    shape_id,
    points: [],
  }));
  for await (const shapePoint of json.shapes) {
    const shape = shapes.get(shapePoint.shape_id);
    shape.points.push({
      position: { lat: shapePoint.shape_pt_lat, lng: shapePoint.shape_pt_lon },
      shape_dist_traveled: shapePoint.shape_dist_traveled,
    });
  }
  return shapes;
}
