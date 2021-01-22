import { Route } from '@hawaii-bus-plus/types';
import { IDBPDatabase } from 'idb';
import { GTFSSchema } from '../database';

export function loadTrips(db: IDBPDatabase<GTFSSchema>) {
  const { store } = db.transaction('trips');
  return store.index('start').openCursor();
}

export function loadTripsForRoute(
  db: IDBPDatabase<GTFSSchema>,
  routeId: Route['route_id']
) {
  const { store } = db.transaction('trips');
  return store.index('route_id').openCursor(IDBKeyRange.only(routeId));
}
