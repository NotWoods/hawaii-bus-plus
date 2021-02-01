import { IDBPDatabase, IDBPObjectStore } from 'idb';
import { Route, Stop } from '@hawaii-bus-plus/types';
import { GTFSSchema } from '../database';

export async function searchWordsIndex<T>(
  objectStore: IDBPObjectStore<any, any, any>,
  searchTerm: string,
  max: number,
  getKey: (item: T) => string
) {
  const index = objectStore.index('words');
  const term = searchTerm.toLowerCase();
  const keyRange = IDBKeyRange.bound(term, `${term}\uffff`, false, false);

  const results = new Map<string, T>();
  let cursor = await index.openCursor(keyRange, 'next');
  while (results.size < max && cursor) {
    results.set(getKey(cursor.value), cursor.value);
    cursor = await cursor.continue();
  }
  return Array.from(results.values());
}

export function searchRoutes(
  db: IDBPDatabase<GTFSSchema>,
  term: string,
  max: number
) {
  const { store } = db.transaction('routes');
  return searchWordsIndex<Route>(store, term, max, (route) => route.route_id);
}

export function searchStops(
  db: IDBPDatabase<GTFSSchema>,
  term: string,
  max: number
) {
  const { store } = db.transaction('stops');
  return searchWordsIndex<Stop>(store, term, max, (stop) => stop.stop_id);
}
