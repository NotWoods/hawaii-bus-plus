import {
  Agency,
  Calendar,
  Route,
  RouteWithTrips,
  Stop,
} from '@hawaii-bus-plus/types';
import { dbReady } from '../database';
import { Repository } from '../repository';
import { loadCalendars } from './calendar';
import { init } from './init';
import { loadAgency, loadRoute, loadRoutes } from './routes';
import { searchRoutes, searchStops } from './search';
import { loadStops, loadStopsSpatial } from './stops';

export class DBRepository implements Repository {
  private ready = dbReady;

  init(): Promise<void> {
    return this.ready.then((db) => init(db));
  }

  loadRoute(routeId: Route['route_id']): Promise<RouteWithTrips | undefined> {
    return this.ready.then((db) => loadRoute(db, routeId));
  }

  loadRoutes(): Promise<RouteWithTrips[]> {
    return this.ready.then((db) => loadRoutes(db));
  }

  loadStops(
    stopIds: Iterable<Stop['stop_id']>
  ): Promise<Map<Stop['stop_id'], Stop>> {
    return this.ready.then((db) => loadStops(db, stopIds));
  }

  loadStopsSpatial(center: google.maps.LatLngLiteral): Promise<Stop[]> {
    return this.ready.then((db) => loadStopsSpatial(db, center));
  }

  loadCalendars(): Promise<Map<Calendar['service_id'], Calendar>> {
    return this.ready.then((db) => loadCalendars(db));
  }

  loadAgency(agencyId: Agency['agency_id']): Promise<Agency | undefined> {
    return this.ready.then((db) => loadAgency(db, agencyId));
  }

  searchRoutes(term: string, max: number): Promise<Route[]> {
    return this.ready.then((db) => searchRoutes(db, term, max));
  }

  searchStops(term: string, max: number): Promise<Stop[]> {
    return this.ready.then((db) => searchStops(db, term, max));
  }
}
