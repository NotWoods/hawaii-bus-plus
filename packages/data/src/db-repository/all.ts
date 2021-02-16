import { Route, StationInformation } from '@hawaii-bus-plus/types';
import { IDBPDatabase } from 'idb';
import { GTFSSchema } from '../database';

export function loadAllRoutes(db: IDBPDatabase<GTFSSchema>): Promise<Route[]> {
  return db.getAll('routes');
}

export function loadBikeStations(
  db: IDBPDatabase<GTFSSchema>
): Promise<StationInformation[]> {
  return db.getAll('bike_stations');
}
