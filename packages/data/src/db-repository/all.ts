import { Route, StationInformation, Stop } from '@hawaii-bus-plus/types';
import { IDBPDatabase } from 'idb';
import { GTFSSchema } from '../database';

export function loadAllRoutes(db: IDBPDatabase<GTFSSchema>): Promise<Route[]> {
  return db.getAll('routes');
}

export function loadAllStops(db: IDBPDatabase<GTFSSchema>): Promise<Stop[]> {
  return db.getAll('stops');
}

export function loadBikeStations(
  db: IDBPDatabase<GTFSSchema>
): Promise<StationInformation[]> {
  return db.getAll('bike_stations');
}
