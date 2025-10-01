import type { Route, Trip } from '@hawaii-bus-plus/types';
import type { IDBPDatabase } from 'idb';
import type { GTFSSchema } from '../database.ts';

export function loadTrip(
  db: IDBPDatabase<GTFSSchema>,
  tripId: Trip['trip_id'],
): Promise<Trip | undefined> {
  return db.get('trips', tripId);
}

export function loadTrips(db: IDBPDatabase<GTFSSchema>) {
  const { store } = db.transaction('trips');
  return store.index('start').openCursor();
}

export function loadTripsForRoute(
  db: IDBPDatabase<GTFSSchema>,
  routeId: Route['route_id'],
) {
  const { store } = db.transaction('trips');
  return store.index('route_id').openCursor(IDBKeyRange.only(routeId));
}
