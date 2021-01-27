import { Agency, Calendar, Route, Stop, Trip } from '@hawaii-bus-plus/types';
import { DBRepository } from './db-repository';
import { MemoryRepository } from './mem-repository';

export interface TripCursor {
  value: Trip;
  continue(): Promise<TripCursor | null>;
}

export interface Repository {
  loadRoutes(
    routeIds: Iterable<Route['route_id']>
  ): Promise<Map<Route['route_id'], Route>>;

  loadTrip(tripId: Trip['trip_id']): Promise<Trip | undefined>;

  loadTrips(): Promise<TripCursor | null>;

  loadTripsForRoute(routeId: Route['route_id']): Promise<TripCursor | null>;

  loadStops(
    stopIds: Iterable<Stop['stop_id']>
  ): Promise<Map<Stop['stop_id'], Stop>>;

  loadStopsSpatial(center: google.maps.LatLngLiteral): Promise<Stop[]>;

  loadCalendars(): Promise<Map<Calendar['service_id'], Calendar>>;

  loadAgency(agencyId: Agency['agency_id']): Promise<Agency | undefined>;

  searchRoutes(term: string, max: number): Promise<Route[]>;

  searchStops(term: string, max: number): Promise<Stop[]>;
}

export function makeRepository() {
  if (self.indexedDB) {
    return new DBRepository();
  } else {
    return new MemoryRepository();
  }
}
