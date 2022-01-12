import { PlainDaysTime } from '@hawaii-bus-plus/temporal-utils';
import type { Shape } from '@hawaii-bus-plus/types';
import { compareAs, toInt, valueNotNull } from '@hawaii-bus-plus/utils';
import { parse } from 'csv-parse';
import { from, zip } from 'ix/iterable/index.js';
import { filter, map } from 'ix/iterable/operators/index.js';
import JSZip, { JSZipObject } from 'jszip';
import type { Temporal } from '@js-temporal/polyfill';
import type { Mutable } from 'type-fest';
import { cacheStations } from '../bike/stations.js';
import { cast } from './cast.js';
import {
  JsonStreams,
  parseAgency,
  parseCalendar,
  parseFeedInfo,
  parseRoutes,
  parseShapes,
  parseStops,
  parseStopTimes,
  parseTrips,
  ServerGTFSData,
  TripInflated,
} from './parsers.js';

const STARTS_WITH_TIME = /^\d\d?:\d\d/;

function formatTime(time: Temporal.PlainTime) {
  return time
    .toLocaleString('en', { hour12: true, hour: 'numeric', minute: '2-digit' })
    .replace(/\s/g, '');
}

export async function zipFilesToObject(
  zipFiles: ReadonlyMap<string, JSZipObject>,
) {
  const arrays = await from(zipFiles.values())
    .pipe(
      map((file) =>
        file.nodeStream('nodebuffer').pipe(parse({ cast, columns: true })),
      ),
      map((parser) => {
        const iter: AsyncIterable<unknown> = parser;
        return iter;
      }),
    )
    .pipe((source) => Promise.all(source));

  return zip(zipFiles.keys(), arrays).pipe((entry) =>
    Object.fromEntries(entry),
  );
}

/**
 * Creates a JSON object representing the Big Island Buses schedule.
 * The JSON data can be written to a file for the client to load later.
 * @param gtfsZipData Buffer data for the GTFS zip file.
 */
export async function createApiData(
  gtfsZipData: Buffer | ArrayBuffer | Uint8Array,
): Promise<[ServerGTFSData, ReadonlyMap<Shape['shape_id'], Shape>]> {
  const bikeStationsReady = cacheStations();
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
    'shapes.txt',
  ];

  const zip = await JSZip.loadAsync(gtfsZipData);
  const zipFiles = from(fileList)
    .pipe(
      map((fileName) => {
        const name = fileName.substring(0, fileName.length - 4);
        const file = zip.file(fileName);
        return [name, file] as const;
      }),
      filter(valueNotNull),
    )
    .pipe((source) => new Map(source));

  const json = (await zipFilesToObject(zipFiles)) as JsonStreams;
  const variable: ServerGTFSData = {
    routes: {},
    stops: {},
    calendar: {},
    agency: {},
    trips: [],
    bike_stations: await bikeStationsReady,
    info: undefined,
  };

  const shapesReady = parseShapes(json);
  const defaultAgencyReady = parseAgency(json, variable);
  const otherReady = Promise.all([
    parseFeedInfo(json, variable),
    parseCalendar(json, variable),
  ]);

  const [trips] = await Promise.all([
    parseTrips(json, variable),
    defaultAgencyReady.then((defaultAgency) =>
      parseRoutes(json, variable, defaultAgency),
    ),
    parseStops(json, variable),
  ]);

  await parseStopTimes(json, variable, trips);
  await otherReady;

  // Sorting and formatting at the end
  variable.trips = Array.from(trips.values())
    .map((t) => {
      const trip = t as Mutable<TripInflated>;
      trip.stop_times.sort(compareAs((st) => st.stop_sequence));
      if (!STARTS_WITH_TIME.test(trip.trip_short_name)) {
        const start = trip.stop_times[0].arrival_time.toPlainTime();
        trip.trip_short_name = `${formatTime(start)} ${trip.trip_short_name}`;
      }
      return trip;
    })
    .sort((a, b) => {
      const aTime = a.stop_times[0].departure_time;
      const bTime = b.stop_times[0].departure_time;
      return PlainDaysTime.compare(aTime, bTime);
    });

  for (const stop of Object.values(variable.stops)) {
    stop.routes.sort(
      compareAs((routeId) => toInt(variable.routes[routeId].route_short_name)),
    );
  }

  return [variable, await shapesReady];
}
