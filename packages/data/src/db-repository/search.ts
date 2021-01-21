import { IDBPDatabase, IDBPObjectStore } from 'idb';
import { Route, Stop } from '@hawaii-bus-plus/types';
import { GTFSSchema } from '../database';

export async function searchWordsIndex<T>(
  objectStore: IDBPObjectStore<any, any, any>,
  searchTerm: string,
  max: number
) {
  const index = objectStore.index('words');
  const term = searchTerm.toLowerCase();
  const keyRange = IDBKeyRange.bound(term, term + '\uffff', false, false);

  const results: T[] = [];
  let cursor = await index.openCursor(keyRange, 'nextunique');
  for (let i = 0; i < max && cursor; i++) {
    results.push(cursor.value);
    cursor = await cursor.continue();
  }
  return results;
}

export function searchRoutes(
  db: IDBPDatabase<GTFSSchema>,
  term: string,
  max: number
) {
  const { store } = db.transaction('routes');
  return searchWordsIndex<Route>(store, term, max);
}

export function searchStops(
  db: IDBPDatabase<GTFSSchema>,
  term: string,
  max: number
) {
  const { store } = db.transaction('stops');
  return searchWordsIndex<Stop>(store, term, max);
}
