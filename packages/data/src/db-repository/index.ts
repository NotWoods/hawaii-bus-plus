import {
  Agency,
  Calendar,
  Route,
  StationInformation,
  Stop,
  Trip,
} from '@hawaii-bus-plus/types';
import { dbReady } from '../database';
import { Repository, TripCursor } from '../repository';
import { loadAllRoutes, loadAllStops, loadBikeStations } from './all';
import { loadAgencies, loadRoutes, loadStops } from './batch';
import { loadCalendars } from './calendar';
import { searchRoutes, searchStops } from './search';
import { loadStopsSpatial } from './stops';
import { loadTrip, loadTrips, loadTripsForRoute } from './trips';

export class DBRepository implements Repository {
  /**
   * Expects database to already be initialized
   */
  private readonly ready = dbReady.then((db) => {
    if (db) {
      return db;
    } else {
      throw new Error('Cannot use DBRepository when IndexedDB unsupported');
    }
  });

  loadAllRoutes(): Promise<readonly Route[]> {
    return this.ready.then((db) => loadAllRoutes(db));
  }

  loadRoutes(
    routeIds: Iterable<Route['route_id']>,
  ): Promise<Map<Route['route_id'], Route>> {
    return this.ready.then((db) => loadRoutes(db, routeIds));
  }

  loadTrip(tripId: Trip['trip_id']): Promise<Trip | undefined> {
    return this.ready.then((db) => loadTrip(db, tripId));
  }

  loadTrips(): Promise<TripCursor> {
    return this.ready.then((db) => loadTrips(db));
  }

  loadTripsForRoute(routeId: Route['route_id']): Promise<TripCursor> {
    return this.ready.then((db) => loadTripsForRoute(db, routeId));
  }

  loadAllStops(): Promise<readonly Stop[]> {
    return this.ready.then((db) => loadAllStops(db));
  }

  loadStops(
    stopIds: Iterable<Stop['stop_id']>,
  ): Promise<Map<Stop['stop_id'], Stop>> {
    return this.ready.then((db) => loadStops(db, stopIds));
  }

  loadStopsSpatial(center: google.maps.LatLngLiteral): Promise<Stop[]> {
    return this.ready.then((db) => loadStopsSpatial(db, center));
  }

  loadCalendars(): Promise<Map<Calendar['service_id'], Calendar>> {
    return this.ready.then((db) => loadCalendars(db));
  }

  loadAgencies(
    agencyIds: Iterable<Agency['agency_id']>,
  ): Promise<Map<Agency['agency_id'], Agency>> {
    return this.ready.then((db) => loadAgencies(db, agencyIds));
  }

  loadBikeStations(): Promise<readonly StationInformation[]> {
    return this.ready.then((db) => loadBikeStations(db));
  }

  searchRoutes(term: string, max: number): Promise<Route[]> {
    return this.ready.then((db) => searchRoutes(db, term, max));
  }

  searchStops(term: string, max: number): Promise<Stop[]> {
    return this.ready.then((db) => searchStops(db, term, max));
  }
}
