import { IDBPDatabase } from 'idb';
import { Route } from '../../shared/gtfs-types';
import { GTFSSchema } from '../database';
import { removeWords } from '../format';

export function loadRoute(
  db: IDBPDatabase<GTFSSchema>,
  routeId: Route['route_id']
) {
  return db.get('routes', routeId).then((route) => route && removeWords(route));
}

export function loadRoutes(db: IDBPDatabase<GTFSSchema>) {
  return db.getAll('routes').then((routes) => routes.map(removeWords));
}
