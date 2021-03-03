import { difference } from '@hawaii-bus-plus/mnemonist';
import {
  Agency,
  Calendar,
  GTFSData,
  Route,
  StationInformation,
  Stop,
  Trip,
} from '@hawaii-bus-plus/types';
import { batch } from '@hawaii-bus-plus/utils';
import { IDBPDatabase } from 'idb';
import {
  GTFSSchema,
  SearchBikeStation,
  SearchRoute,
  SearchStop,
  SearchTrip,
} from '../database.js';
import { downloadScheduleData, NotModifiedError } from '../fetch.js';
import { getWords } from '../words.js';

export async function init(db: IDBPDatabase<GTFSSchema>) {
  const storedTag = (await db.get('keyval', 'etag')) as string | undefined;
  try {
    const { api, eTag } = await downloadScheduleData({ storedTag });
    await initDatabase(db, api, eTag);
  } catch (err: unknown) {
    if (err instanceof NotModifiedError) {
      console.info('Database has not changed');
    } else {
      throw err;
    }
  }
}

type StoreName = keyof typeof transformers;

const transformers = {
  routes(r: Route) {
    const route = r as SearchRoute;
    route.words = getWords(route.route_short_name, route.route_long_name);
    return route;
  },
  trips(t: Trip) {
    const trip = t as SearchTrip;
    trip.start = t.stop_times[0].departure_time;
    return trip;
  },
  stops(s: Stop) {
    const stop = s as SearchStop;
    stop.words = getWords(stop.stop_name, stop.stop_desc);
    return stop;
  },
  calendar: (calendar: Calendar) => calendar,
  agency: (agency: Agency) => agency,
  bike_stations: (s: StationInformation) => {
    const station = s as SearchBikeStation;
    station.words = getWords(station.name, station.address ?? '');
    return station;
  },
};
const storeNames = Object.keys(transformers) as StoreName[];

function keySet(api: GTFSData, name: StoreName): ReadonlySet<string> {
  switch (name) {
    case 'trips':
      return new Set(api.trips.map((trip) => trip.trip_id));
    default: {
      const record: { [id: string]: unknown } = api[name];
      return new Set(Object.keys(record));
    }
  }
}

/**
 * Initialize the database by storing values from the API data.
 * Old data will be deleted.
 * @param db Reference to loaded database
 * @param api API data to store.
 */
export async function initDatabase(
  db: IDBPDatabase<GTFSSchema>,
  api: GTFSData,
  eTag?: string
) {
  const allStores = (storeNames as ('keyval' | StoreName)[]).concat('keyval');
  const tx = db.transaction(allStores, 'readwrite');
  const jobs: Promise<unknown>[] = [];

  jobs.push(tx.objectStore('keyval').put(eTag, 'etag'));

  // Prepare to gather the existing keys before inserting new items
  const existingKeysReady = batch(
    storeNames,
    async (storeName) => new Set(await tx.objectStore(storeName).getAllKeys())
  );

  for (const [storeName, transform] of Object.entries(transformers)) {
    const name = storeName as StoreName;
    const store = tx.objectStore(name);
    for (const item of Object.values(api[name])) {
      const transformed = transform(item);
      jobs.push(store.put(transformed));
    }
  }

  // Await here to load the stores that need to be deleted
  const removedKeys = Array.from(await existingKeysReady)
    .map(([storeName, keys]) => {
      const removed = difference(keys, keySet(api, storeName));
      return [storeName, removed] as const;
    })
    .filter(([, keys]) => keys.size > 0);

  if (removedKeys.length > 0) {
    const nonEmpty = removedKeys.map(([storeName]) => storeName);
    // New transaction because the previous one will be closed by now
    const deleteTx = db.transaction(nonEmpty, 'readwrite');

    for (const [storeName, removed] of removedKeys) {
      for (const key of removed) {
        jobs.push(deleteTx.objectStore(storeName).delete(key as any));
      }
    }
  }

  await Promise.all(jobs);
}
