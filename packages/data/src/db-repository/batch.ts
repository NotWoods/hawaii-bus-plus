import { Agency, Route, Stop } from '@hawaii-bus-plus/types';
import { batch } from '@hawaii-bus-plus/utils';
import { IDBPDatabase, StoreKey } from 'idb';
import { GTFSSchema } from '../database.js';

function batchLoad<Name extends 'routes' | 'agency' | 'stops'>(
  storeName: Name,
) {
  return (
    db: IDBPDatabase<GTFSSchema>,
    ids: Iterable<StoreKey<GTFSSchema, Name>>,
  ) => {
    const { store } = db.transaction(storeName);
    return batch(new Set(ids), (id) => store.get(id));
  };
}

export const loadRoutes: (
  db: IDBPDatabase<GTFSSchema>,
  routeIds: Iterable<Route['route_id']>,
) => Promise<Map<Route['route_id'], Route>> = batchLoad('routes');

export const loadAgencies: (
  db: IDBPDatabase<GTFSSchema>,
  agencyIds: Iterable<Agency['agency_id']>,
) => Promise<Map<Agency['agency_id'], Agency>> = batchLoad('agency');

export const loadStops: (
  db: IDBPDatabase<GTFSSchema>,
  stopIds: Iterable<Stop['stop_id']>,
) => Promise<Map<Stop['stop_id'], Stop>> = batchLoad('stops');
