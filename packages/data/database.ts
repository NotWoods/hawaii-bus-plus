import { DBSchema, openDB } from 'idb';
import { Calendar, Route, RouteWithTrips, Stop } from '../shared/gtfs-types';

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
  calendar: {
    value: Calendar;
    key: Calendar['service_id'];
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
    db.createObjectStore('calendar', { keyPath: 'service_id' });

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
