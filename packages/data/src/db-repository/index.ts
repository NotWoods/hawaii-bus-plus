import { Agency, Calendar, Route, Stop } from '@hawaii-bus-plus/types';
import { dbReady } from '../database';
import { Repository, TripCursor } from '../repository';
import { loadCalendars } from './calendar';
import { init } from './init';
import { loadAgency, loadRoute } from './routes';
import { searchRoutes, searchStops } from './search';
import { loadStops, loadStopsSpatial } from './stops';
import { loadTrips, loadTripsForRoute } from './trips';

export class DBRepository implements Repository {
  private ready = dbReady;

  init(): Promise<void> {
    return this.ready.then((db) => init(db));
  }

  loadRoute(routeId: Route['route_id']): Promise<Route | undefined> {
    return this.ready.then((db) => loadRoute(db, routeId));
  }

  loadTrips(): Promise<TripCursor | null> {
    return this.ready.then((db) => loadTrips(db));
  }

  loadTripsForRoute(routeId: Route['route_id']): Promise<TripCursor | null> {
    return this.ready.then((db) => loadTripsForRoute(db, routeId));
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
