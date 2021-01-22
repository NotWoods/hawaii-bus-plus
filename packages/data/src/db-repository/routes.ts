import { IDBPDatabase } from 'idb';
import { Agency, Route } from '@hawaii-bus-plus/types';
import { GTFSSchema } from '../database';
import { removeWords } from '../format';

export function loadRoute(
  db: IDBPDatabase<GTFSSchema>,
  routeId: Route['route_id']
) {
  return db.get('routes', routeId).then((route) => route && removeWords(route));
}

export function loadAgency(
  db: IDBPDatabase<GTFSSchema>,
  agencyId: Agency['agency_id']
) {
  return db.get('agency', agencyId);
}
