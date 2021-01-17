import parse from 'csv-parse';
import { toArray } from 'ix/asynciterable/index.js';
import { from, zip } from 'ix/iterable/index.js';
import { filter, map } from 'ix/iterable/operators/index.js';
import JSZip, { JSZipObject } from 'jszip';
import type { Mutable } from 'type-fest';
import type {
  Calendar,
  CsvCalendar,
  CsvRoute,
  CsvStop,
  CsvStopTime,
  CsvTrip,
  ServerGTFSData,
  Route,
  Stop,
  StopTime,
  Trip,
  FeedInfo,
  CsvTransfer,
} from '../shared/gtfs-types.js';
import { stringTime } from '../shared/utils/date.js';
import { cast } from './cast.js';

const STARTS_WITH_TIME = /^\d\d?:\d\d/;

export async function zipFilesToObject(zipFiles: Map<string, JSZipObject>) {
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

function makeCalendarTextName(days: Calendar['days']) {
  switch (days.join(', ')) {
    case 'true, true, true, true, true, true, true':
      return 'Daily';
    case 'false, true, true, true, true, true, true':
      return 'Mon - Sat';
    case 'false, true, true, true, true, true, false':
      return 'Monday - Friday';
    case 'true, false, false, false, false, false, true':
      return 'Sat - Sun';
    case 'false, false, false, false, false, false, true':
      return 'Saturday';
    default:
      const firstDay = days.indexOf(true);
      const lastDay = days.lastIndexOf(true);

      const reference = [
        'Sunday',
        'Monday',
        'Tuesday',
        'Wednesday',
        'Thursday',
        'Friday',
        'Saturday',
      ];
      if (firstDay === lastDay) {
        return reference[firstDay];
      } else {
        return reference[firstDay] + ' - ' + reference[lastDay];
      }
  }
}

/**
 * Creates a JSON object representing the Big Island Buses schedule.
 * The JSON data can be written to a file for the client to load later.
 * @param gtfsZipData Buffer data for the GTFS zip file.
 */
export async function createApiData(
  gtfsZipData: Buffer | ArrayBuffer | Uint8Array
): Promise<ServerGTFSData> {
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
      filter((entry): entry is [string, JSZipObject] => {
        const [, file] = entry;
        return file != null;
      })
    )
    .pipe((source) => new Map(source));

  const json = (await zipFilesToObject(zipFiles)) as {
    routes: CsvRoute[];
    trips: CsvTrip[];
    stops: CsvStop[];
    calendar: CsvCalendar[];
    stop_times: CsvStopTime[];
    feed_info: FeedInfo[];
    transfers: CsvTransfer[];
  };
  const transfers = new Map<Stop['stop_id'], Stop['stop_id'][]>();
  const variable: ServerGTFSData = {
    routes: {},
    stops: {},
    calendar: {},
    trips: {},
    info: json.feed_info[0],
  };

  for (const csvRoute of json.routes) {
    const route = csvRoute as Mutable<Route>;
    route.trips = {};
    variable.routes[route.route_id] = route;
  }
  for (const csvTrip of json.trips) {
    const trip = csvTrip as Mutable<Trip>;
    trip.stop_times = [];
    variable.routes[trip.route_id].trips[trip.trip_id] = trip;
    variable.trips[trip.trip_id] = trip.route_id;
  }
  for (const csvTransfer of json.transfers) {
    if (csvTransfer.transfer_type === 0) {
      const otherStops = transfers.get(csvTransfer.from_stop_id) || [];
      otherStops.push(csvTransfer.to_stop_id);
      transfers.set(csvTransfer.from_stop_id, otherStops);
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
      trips: [],
      routes: [],
      transfers: transfers.get(csvStop.stop_id) || [],
    };
    variable.stops[stop.stop_id] = stop;
  }
  for (const csvCalendar of json.calendar) {
    const days: Calendar['days'] = [
      csvCalendar.sunday,
      csvCalendar.monday,
      csvCalendar.tuesday,
      csvCalendar.wednesday,
      csvCalendar.thursday,
      csvCalendar.friday,
      csvCalendar.saturday,
    ];
    const calendar: Calendar = {
      service_id: csvCalendar.service_id,
      start_date: csvCalendar.start_date,
      end_date: csvCalendar.end_date,
      days,
      text_name: makeCalendarTextName(days),
    };
    variable.calendar[calendar.service_id] = calendar;
  }
  for (const csvStopTime of json.stop_times) {
    const stopTime = (csvStopTime as unknown) as Mutable<StopTime>;
    delete (csvStopTime as Partial<CsvStopTime>).continuous_drop_off;
    delete (csvStopTime as Partial<CsvStopTime>).drop_off_type;

    const stop = variable.stops[stopTime.stop_id];
    const route_id = variable.trips[csvStopTime.trip_id];
    const route = variable.routes[route_id];
    const trip = route.trips[csvStopTime.trip_id];

    trip.stop_times.push(stopTime);

    const tripAdded = stop.trips.find(
      ({ trip }) => trip === csvStopTime.trip_id
    );
    if (!tripAdded) {
      stop.trips.push({
        trip: csvStopTime.trip_id,
        dir: trip.direction_id,
        route: route_id,
        sequence: stopTime.stop_sequence,
        time: stopTime.arrival_time,
      });
    }
    if (!stop.routes.includes(route_id)) {
      stop.routes.push(route_id);
    }
    delete (csvStopTime as Partial<CsvStopTime>).trip_id;
  }

  for (const route of Object.values(variable.routes)) {
    for (const t of Object.values(route.trips)) {
      const trip = t as Mutable<Trip>;
      trip.stop_times.sort((a, b) => a.stop_sequence - b.stop_sequence);
      if (!STARTS_WITH_TIME.test(trip.trip_short_name)) {
        const start = trip.stop_times[0].arrival_time;
        trip.trip_short_name = `${stringTime(start)} ${trip.trip_short_name}`;
      }
    }
  }

  return variable;
}
