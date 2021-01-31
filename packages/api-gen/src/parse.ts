import type { GTFSData, Shape, Trip } from '@hawaii-bus-plus/types';
import {
  compareAs,
  PlainDaysTime,
  stringTime,
  toInt,
  valueNotNull,
} from '@hawaii-bus-plus/utils';
import parse from 'csv-parse';
import { from, zip } from 'ix/iterable/index.js';
import { filter, map } from 'ix/iterable/operators/index.js';
import JSZip, { JSZipObject } from 'jszip';
import type { Mutable } from 'type-fest';
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
} from './parsers.js';

const STARTS_WITH_TIME = /^\d\d?:\d\d/;

export async function zipFilesToObject(
  zipFiles: ReadonlyMap<string, JSZipObject>
) {
  const arrays = await from(zipFiles.values())
    .pipe(
      map((file) =>
        file.nodeStream('nodebuffer').pipe(parse({ cast, columns: true }))
      ),
      map((parser) => {
        const iter: AsyncIterable<unknown> = parser;
        return iter;
      })
    )
    .pipe((source) => Promise.all(source));

  return zip(zipFiles.keys(), arrays).pipe((entry) =>
    Object.fromEntries(entry)
  );
}

/**
 * Creates a JSON object representing the Big Island Buses schedule.
 * The JSON data can be written to a file for the client to load later.
 * @param gtfsZipData Buffer data for the GTFS zip file.
 */
export async function createApiData(
  gtfsZipData: Buffer | ArrayBuffer | Uint8Array
): Promise<[GTFSData, ReadonlyMap<Shape['shape_id'], Shape>]> {
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
      filter(valueNotNull)
    )
    .pipe((source) => new Map(source));

  const json = (await zipFilesToObject(zipFiles)) as JsonStreams;
  const variable: GTFSData = {
    routes: {},
    stops: {},
    calendar: {},
    agency: {},
    trips: [],
    info: undefined as any,
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
      parseRoutes(json, variable, defaultAgency)
    ),
    parseStops(json, variable),
  ]);

  await parseStopTimes(json, variable, trips);
  await otherReady;

  // Sorting and formatting at the end
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

  return [variable, await shapesReady];
}
