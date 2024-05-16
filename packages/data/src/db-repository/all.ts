import type { Route, StationInformation, Stop } from '@hawaii-bus-plus/types';
import type { IDBPDatabase } from 'idb';
import type { GTFSSchema } from '../database.js';

export function loadAllRoutes(db: IDBPDatabase<GTFSSchema>): Promise<Route[]> {
  return db.getAll('routes');
}

export function loadAllStops(db: IDBPDatabase<GTFSSchema>): Promise<Stop[]> {
  return db.getAll('stops');
}

export function loadBikeStations(
  db: IDBPDatabase<GTFSSchema>,
): Promise<StationInformation[]> {
  return db.getAll('bike_stations');
}
