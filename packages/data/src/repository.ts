import type {
  Agency,
  Calendar,
  Route,
  StationInformation,
  Stop,
  Trip,
} from '@hawaii-bus-plus/types';
import { memoize } from '@hawaii-bus-plus/utils';
import type { LatLngLiteral } from 'spherical-geometry-js';
import { IDB_SUPPORT } from './database.js';
import { DBRepository } from './db-repository/index.js';
import { MemoryRepository } from './mem-repository/index.js';

export type TripCursor = {
  value: Trip;
  continue(): Promise<TripCursor>;
} | null;

export interface Repository {
  loadAllRoutes(): Promise<readonly Route[]>;

  loadRoutes(
    routeIds: Iterable<Route['route_id']>,
  ): Promise<Map<Route['route_id'], Route>>;

  loadTrip(tripId: Trip['trip_id']): Promise<Trip | undefined>;

  loadTrips(): Promise<TripCursor>;

  loadTripsForRoute(routeId: Route['route_id']): Promise<TripCursor>;

  loadAllStops(): Promise<readonly Stop[]>;

  loadStops(
    stopIds: Iterable<Stop['stop_id']>,
  ): Promise<Map<Stop['stop_id'], Stop>>;

  loadStopsSpatial(center: LatLngLiteral): Promise<Stop[]>;

  loadCalendars(): Promise<Map<Calendar['service_id'], Calendar>>;

  loadAgencies(
    agencyIds: Iterable<Agency['agency_id']>,
  ): Promise<Map<Agency['agency_id'], Agency>>;

  loadBikeStations(): Promise<readonly StationInformation[]>;

  searchRoutes(term: string, max: number): Promise<Route[]>;

  searchStops(term: string, max: number): Promise<Stop[]>;
}

export const makeRepository = memoize(() => {
  if (IDB_SUPPORT) {
    return new DBRepository();
  } else {
    return new MemoryRepository();
  }
});
