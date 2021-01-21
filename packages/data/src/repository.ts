import { Calendar, Route, RouteWithTrips, Stop } from '@hawaii-bus-plus/types';
import { DBRepository } from './db-repository';
import { MemoryRepository } from './mem-repository';

export interface Repository {
  init(): Promise<void>;

  loadRoute(routeId: Route['route_id']): Promise<RouteWithTrips | undefined>;

  loadRoutes(): Promise<RouteWithTrips[]>;

  loadStops(
    stopIds: Iterable<Stop['stop_id']>
  ): Promise<Map<Stop['stop_id'], Stop>>;

  loadStopsSpatial(center: google.maps.LatLngLiteral): Promise<Stop[]>;

  loadCalendars(): Promise<Map<Calendar['service_id'], Calendar>>;

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
