import { openDB, DBSchema } from 'idb';
import { GTFSData, Route, RouteWithTrips, Stop } from '../shared/gtfs-types';

export interface SearchRoute extends RouteWithTrips {
  words: readonly string[];
}

export interface SearchStop extends Stop {
  words: readonly string[];
}

export interface GTFSSchema extends DBSchema {
  routes: {
    value: SearchRoute;
    key: Route['route_id'];
    indexes: { words: string[] };
  };
  stops: {
    value: SearchStop;
    key: Stop['stop_id'];
    indexes: {
      words: string[];
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

export function getWords(...strings: string[]) {
  return strings
    .flatMap((str) => str.split(' '))
    .flatMap((str) => str.split('-').concat([str]))
    .filter(Boolean)
    .map((word) => word.toLowerCase());
}

export const dbReady = openDB<GTFSSchema>('gtfs', 1, {
  upgrade(db) {
    db.createObjectStore('keyval');

    const routeStore = db.createObjectStore('routes', {
      keyPath: 'route_id',
    });
    routeStore.createIndex('words', 'words', { multiEntry: true });

    const stopStore = db.createObjectStore('stops', {
      keyPath: 'stop_id',
    });
    stopStore.createIndex('words', 'words', { multiEntry: true });
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
  for (const r of Object.values(api.routes)) {
    const route = r as SearchRoute;
    route.words = getWords(route.route_short_name, route.route_long_name);
    routeStore.put(route);
  }

  const stopStore = tx.objectStore('stops');
  for (const s of Object.values(api.stops)) {
    const stop = s as SearchStop;
    stop.words = getWords(stop.stop_name, stop.stop_desc);
    stopStore.put(stop);
  }
}
