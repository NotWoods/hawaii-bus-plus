import { openDB, DBSchema } from 'idb';
import { GTFSData, Route, Stop } from '../shared/gtfs-types';

export interface GTFSSchema extends DBSchema {
  routes: {
    value: Route;
    key: Route['route_id'];
  };
  stops: {
    value: Stop;
    key: Stop['stop_id'];
    indexes: {
      routes: Route['route_id'][];
      stop_lat: number;
      stop_lon: number;
    };
  };
  keyval: {
    value: unknown;
    key: string;
  };
}

export const dbReady = openDB<GTFSSchema>('gtfs', 1, {
  upgrade(db) {
    db.createObjectStore('keyval');

    db.createObjectStore('routes', {
      keyPath: 'route_id',
    });

    const stopStore = db.createObjectStore('stops', {
      keyPath: 'stop_id',
    });
    stopStore.createIndex('routes', 'routes', { multiEntry: true });
    stopStore.createIndex('stop_lat', ['position', 'lat']);
    stopStore.createIndex('stop_lon', ['position', 'lng']);
  },
});

export async function initDatabase(api: GTFSData) {
  const db = await dbReady;

  /*const feedVersion = await db.get('keyval', 'feed_version');
  if (feedVersion === api.info.feed_version) {
    return;
  }*/

  const tx = db.transaction(['routes', 'stops'], 'readwrite');

  const routeStore = tx.objectStore('routes');
  Object.values(api.routes).forEach((route) => routeStore.put(route));

  const stopStore = tx.objectStore('stops');
  Object.values(api.stops).forEach((stop) => stopStore.put(stop));
}
