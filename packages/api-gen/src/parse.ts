import type {
  Agency,
  Calendar,
  CsvAgency,
  CsvCalendar,
  CsvCalendarDates,
  CsvRoute,
  CsvStop,
  CsvStopTime,
  CsvTransfer,
  CsvTrip,
  FeedInfo,
  GTFSData,
  Route,
  Stop,
  StopTime,
  TimeString,
  Transfer,
  Trip,
} from '@hawaii-bus-plus/types';
import { DateString } from '@hawaii-bus-plus/types';
import {
  compareAs,
  PlainDaysTime,
  stringTime,
  toInt,
  valueNotNull,
} from '@hawaii-bus-plus/utils';
import parse from 'csv-parse';
import { toArray } from 'ix/asynciterable/index.js';
import { from, zip } from 'ix/iterable/index.js';
import { filter, map } from 'ix/iterable/operators/index.js';
import JSZip, { JSZipObject } from 'jszip';
import mnemonist from 'mnemonist';
import type { Mutable } from 'type-fest';
import { cast } from './cast.js';

const { MultiMap } = mnemonist;
const STARTS_WITH_TIME = /^\d\d?:\d\d/;

export async function zipFilesToObject(
  zipFiles: ReadonlyMap<string, JSZipObject>
) {
  const arrays = await from(zipFiles.values())
    .pipe(
      map((file) =>
        file.nodeStream('nodebuffer').pipe(parse({ cast, columns: true }))
      ),
      map((stream) => toArray(stream))
    )
    .pipe((source) => Promise.all(source));

  return zip(zipFiles.keys(), arrays).pipe((entry) =>
    Object.fromEntries(entry)
  );
}

function fixTimeString(time: string) {
  return time.padStart('00:00:00'.length, '0') as TimeString;
}

/**
 * Creates a JSON object representing the Big Island Buses schedule.
 * The JSON data can be written to a file for the client to load later.
 * @param gtfsZipData Buffer data for the GTFS zip file.
 */
export async function createApiData(
  gtfsZipData: Buffer | ArrayBuffer | Uint8Array
): Promise<GTFSData> {
  const fileList = [
    'agency.txt',
    'calendar.txt',
    'calendar_dates.txt',
    'fare_attributes.txt',
    'feed_info.txt',
    'routes.txt',
    'stop_times.txt',
    'stops.txt',
    'transfers.txt',
    'trips.txt',
  ];

  const zip = await JSZip.loadAsync(gtfsZipData);
  const zipFiles = from(fileList)
    .pipe(
      map((fileName) => {
        const name = fileName.substring(0, fileName.length - 4);
        const file = zip.file(fileName);
        return [name, file] as const;
      }),
      filter(valueNotNull)
    )
    .pipe((source) => new Map(source));

  const json = (await zipFilesToObject(zipFiles)) as {
    routes: CsvRoute[];
    trips: CsvTrip[];
    stops: CsvStop[];
    calendar: CsvCalendar[];
    calendar_dates: CsvCalendarDates[];
    stop_times: CsvStopTime[];
    feed_info: FeedInfo[];
    transfers: CsvTransfer[];
    agency: CsvAgency[];
  };
  const variable: GTFSData = {
    routes: {},
    stops: {},
    calendar: {},
    agency: {},
    trips: [],
    info: json.feed_info[0],
  };
  json.routes.sort(compareAs((route) => route.route_sort_order));

  for (const csvAgency of json.agency) {
    variable.agency[csvAgency.agency_id] = csvAgency;
  }
  const agencies = Object.keys(variable.agency) as Agency['agency_id'][];
  const defaultAgency = agencies.length === 1 ? agencies[0] : undefined;
  for (const csvRoute of json.routes) {
    const route = csvRoute as Mutable<Route>;
    route.agency_id ||= defaultAgency!;
    variable.routes[route.route_id] = route;
  }
  const trips = new Map<Trip['trip_id'], Trip>();
  for (const csvTrip of json.trips) {
    const trip = csvTrip as Mutable<Trip>;
    trip.stop_times = [];
    variable.trips.push(trip);
    trips.set(trip.trip_id, trip);
  }
  const transfers = new MultiMap<Stop['stop_id'], Transfer>();
  for (const csvTransfer of json.transfers) {
    if (csvTransfer.transfer_type !== 3) {
      transfers.set(csvTransfer.from_stop_id, csvTransfer);
    }
  }
  for (const csvStop of json.stops) {
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
  const calendarDates = new MultiMap<
    Calendar['service_id'],
    CsvCalendarDates
  >();
  for (const csvCalendarDate of json.calendar_dates) {
    calendarDates.set(csvCalendarDate.service_id, csvCalendarDate);
  }
  for (const csvCalendar of json.calendar) {
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
  for (const csvStopTime of json.stop_times) {
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

  variable.trips = Array.from(trips.values())
    .map((t) => {
      const trip = t as Mutable<Trip>;
      trip.stop_times.sort(compareAs((st) => st.stop_sequence));
      if (!STARTS_WITH_TIME.test(trip.trip_short_name)) {
        const start = trip.stop_times[0].arrival_time;
        trip.trip_short_name = `${stringTime(start)} ${trip.trip_short_name}`;
      }
      return trip;
    })
    .sort((a, b) => {
      const aTime = PlainDaysTime.from(a.stop_times[0].departure_time);
      const bTime = PlainDaysTime.from(b.stop_times[0].departure_time);
      return PlainDaysTime.compare(aTime, bTime);
    });

  for (const stop of Object.values(variable.stops)) {
    stop.routes.sort(
      compareAs((routeId) => toInt(variable.routes[routeId].route_short_name))
    );
  }

  return variable;
}
