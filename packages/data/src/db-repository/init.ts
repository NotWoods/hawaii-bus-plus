import {
  Agency,
  Calendar,
  GTFSData,
  Route,
  Stop,
  Trip,
} from '@hawaii-bus-plus/types';
import { batch } from '@hawaii-bus-plus/utils';
import { IDBPDatabase } from 'idb';
import { difference } from 'mnemonist/set';
import {
  GTFSSchema,
  SearchRoute,
  SearchStop,
  SearchTrip,
} from '../database.js';
import { downloadScheduleData } from '../fetch.js';
import { getWords } from '../words.js';

export async function init(db: IDBPDatabase<GTFSSchema>) {
  return downloadScheduleData().then((api) => initDatabase(db, api));
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
};
const storeNames = Object.keys(transformers) as StoreName[];

export async function initDatabase(
  db: IDBPDatabase<GTFSSchema>,
  api: GTFSData
) {
  const tx = db.transaction(storeNames, 'readwrite');
  const jobs: Promise<unknown>[] = [];

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

  const nonEmpty = Array.from(await existingKeysReady)
    .filter(([, keys]) => keys.size > 0)
    .map(([storeName]) => storeName);
  const deleteTx = db.transaction(nonEmpty, 'readwrite');

  for (const [storeName, existingKeys] of await existingKeysReady) {
    const removed = difference(
      existingKeys,
      new Set(Object.keys(api[storeName]))
    );
    for (const key of removed) {
      jobs.push(deleteTx.objectStore(storeName).delete(key as any));
    }
  }
  await Promise.all(jobs);
}
