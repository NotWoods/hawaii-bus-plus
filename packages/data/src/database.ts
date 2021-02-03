import {
  Agency,
  Calendar,
  Route,
  Stop,
  TimeString,
  Trip,
} from '@hawaii-bus-plus/types';
import { DBSchema, IDBPDatabase, openDB, OpenDBCallbacks } from 'idb';

export interface SearchRoute extends Route {
  words: readonly string[];
}

export interface SearchStop extends Stop {
  words: readonly string[];
}

export interface SearchTrip extends Trip {
  start: TimeString;
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
  trips: {
    value: SearchTrip;
    key: Trip['trip_id'];
    indexes: {
      start: TimeString;
      route_id: Route['route_id'];
    };
  };
  calendar: {
    value: Calendar;
    key: Calendar['service_id'];
  };
  agency: {
    value: Agency;
    key: Agency['agency_id'];
  };
  keyval: {
    value: unknown;
    key: string;
  };
}

const callbacks: OpenDBCallbacks<GTFSSchema> = {
  upgrade(db) {
    db.createObjectStore('keyval');
    db.createObjectStore('calendar', { keyPath: 'service_id' });
    db.createObjectStore('agency', { keyPath: 'agency_id' });

    const routeStore = db.createObjectStore('routes', { keyPath: 'route_id' });
    routeStore.createIndex('words', 'words', { multiEntry: true });

    const stopStore = db.createObjectStore('stops', { keyPath: 'stop_id' });
    stopStore.createIndex('words', 'words', { multiEntry: true });
    stopStore.createIndex('routes', 'routes', { multiEntry: true });
    stopStore.createIndex('stop_lat', ['position', 'lat']);
    stopStore.createIndex('stop_lon', ['position', 'lng']);

    const tripStore = db.createObjectStore('trips', { keyPath: 'trip_id' });
    tripStore.createIndex('route_id', 'route_id');
    tripStore.createIndex('start', 'start');
  },
};

export const dbReady: Promise<IDBPDatabase<GTFSSchema>> = self.indexedDB
  ? openDB<GTFSSchema>('gtfs', 1, callbacks)
  : Promise.resolve(undefined as any);
