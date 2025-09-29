import type { Route, Stop } from '@hawaii-bus-plus/types';
import { batch, take } from '@hawaii-bus-plus/utils';
import type { IDBPDatabase } from 'idb';
import '@hawaii-bus-plus/polyfills/intersection';
import type { GTFSSchema } from '../database.js';
import { removeWords } from '../format.js';

function interset<T>(sets: readonly ReadonlySet<T>[]): ReadonlySet<T> {
  return sets
    .slice(1)
    .reduce((acc, set) => acc.intersection(set), sets[0] ?? new Set());
}

export async function searchWordsIndex<Name extends 'routes' | 'stops'>(
  db: IDBPDatabase<GTFSSchema>,
  dbName: Name,
  searchTerm: string,
  max: number,
) {
  const index = db.transaction(dbName).store.index('words');
  const terms = searchTerm.toLowerCase().split(/\s/g);
  const resultsPerTerm = await Promise.all(
    terms.map(async (term) => {
      const keyRange = IDBKeyRange.bound(term, `${term}\uffff`, false, false);
      const keys = await index.getAllKeys(keyRange);
      return new Set(keys);
    }),
  );

  const andQuery = take(interset(resultsPerTerm), max);
  const { store } = db.transaction(dbName);
  const results = await batch(andQuery, (key) => store.get(key));
  return Array.from(results.values(), removeWords);
}

export function searchRoutes(
  db: IDBPDatabase<GTFSSchema>,
  term: string,
  max: number,
): Promise<Route[]> {
  return searchWordsIndex(db, 'routes', term, max);
}

export function searchStops(
  db: IDBPDatabase<GTFSSchema>,
  term: string,
  max: number,
): Promise<Stop[]> {
  return searchWordsIndex(db, 'stops', term, max);
}
