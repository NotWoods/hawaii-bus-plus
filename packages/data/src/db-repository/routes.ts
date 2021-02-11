import { Route } from '@hawaii-bus-plus/types';
import { IDBPDatabase } from 'idb';
import { GTFSSchema } from '../database';

export function loadAllRoutes(db: IDBPDatabase<GTFSSchema>): Promise<Route[]> {
  return db.getAll('routes');
}
