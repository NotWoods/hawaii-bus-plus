import { Agency, Route } from '@hawaii-bus-plus/types';
import { batch } from '@hawaii-bus-plus/utils';
import { IDBPDatabase } from 'idb';
import { GTFSSchema } from '../database';
import { unique } from '../format';

export function loadRoutes(
  db: IDBPDatabase<GTFSSchema>,
  routeIds: Iterable<Route['route_id']>
): Promise<Map<Route['route_id'], Route>> {
  const { store } = db.transaction('routes');
  return batch(unique(routeIds), (routeId) => store.get(routeId));
}

export function loadAgency(
  db: IDBPDatabase<GTFSSchema>,
  agencyId: Agency['agency_id']
): Promise<Agency | undefined> {
  return db.get('agency', agencyId);
}
