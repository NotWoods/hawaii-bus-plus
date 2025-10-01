import { PlainDaysTime } from '@hawaii-bus-plus/temporal-utils';
import type { Shape } from '@hawaii-bus-plus/types';
import { compareAs, toInt, valueNotNull } from '@hawaii-bus-plus/utils';
import type { Temporal } from '@js-temporal/polyfill';
import { parse } from 'csv-parse';
import JSZip, { type JSZipObject } from 'jszip';
import type { Writable } from 'type-fest';
import { cacheStations } from '../bike/stations.ts';
import { cast } from './cast.ts';
import { zip } from './itertools.ts';
import {
  parseAgency,
  parseCalendar,
  parseFeedInfo,
  parseRoutes,
  parseShapes,
  parseStopTimes,
  parseStops,
  parseTrips,
  type JsonStreams,
  type ServerGTFSData,
  type TripInflated,
} from './parsers.ts';
import { removeHiddenCharacters } from './stream.ts';

const STARTS_WITH_TIME = /^\d\d?:\d\d/;

function formatTime(time: Temporal.PlainTime) {
  return time
    .toLocaleString('en', { hour12: true, hour: 'numeric', minute: '2-digit' })
    .replace(/\s/g, '');
}

export async function zipFilesToObject<Keys extends string>(
  zipFiles: ReadonlyMap<Keys, JSZipObject>,
): Promise<Record<Keys, AsyncIterable<unknown>>> {
  const arrays = await Promise.all(
    // eslint-disable-next-line @typescript-eslint/await-thenable -- TODO test if Promise.all can be removed
    Array.from(zipFiles.values())
      .map((file) =>
        file
          .nodeStream('nodebuffer')
          .pipe(removeHiddenCharacters())
          .pipe(parse({ cast, columns: true, trim: true })),
      )
      .map((parser): AsyncIterable<unknown> => parser),
  );

  const entries = zip(zipFiles.keys(), arrays);
  return Object.fromEntries(entries) as Record<Keys, AsyncIterable<unknown>>;
}

/**
 * Creates a JSON object representing the Big Island Buses schedule.
 * The JSON data can be written to a file for the client to load later.
 * @param gtfsZipData Buffer data for the GTFS zip file.
 */
export async function createApiData(
  gtfsZipData: ArrayBuffer | Uint8Array,
): Promise<
  [api: ServerGTFSData, shapes: ReadonlyMap<Shape['shape_id'], Shape>]
> {
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
  const zipFiles = new Map(
    fileList
      .map((fileName) => {
        const name = fileName.substring(0, fileName.length - 4);
        const file = zip.file(fileName);
        return [name, file] as const;
      })
      .filter(valueNotNull),
  );

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
      const trip = t as Writable<TripInflated>;
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
