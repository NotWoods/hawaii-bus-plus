import {
  Agency,
  Calendar,
  GTFSData,
  Route,
  Stop,
  Trip,
} from '@hawaii-bus-plus/types';
import { downloadScheduleData } from '../fetch';
import { unique } from '../format';
import { Repository, TripCursor } from '../repository';
import { searchArray } from './search';
import { memTripCursor } from './trips';

export class MemoryRepository implements Repository {
  protected apiReady!: Promise<GTFSData>;

  constructor() {
    this.init();
  }

  init(): Promise<void> {
    this.apiReady = downloadScheduleData();
    return this.apiReady.then(() => {});
  }

  loadRoutes(
    routeIds: Iterable<Route['route_id']>
  ): Promise<Map<Route['route_id'], Route>> {
    return this.apiReady.then(
      (api) =>
        new Map(unique(routeIds, (routeId) => [routeId, api.routes[routeId]]))
    );
  }

  loadTrip(tripId: Trip['trip_id']): Promise<Trip | undefined> {
    return this.apiReady.then((api) =>
      api.trips.find((trip) => trip.trip_id === tripId)
    );
  }

  loadTrips(): Promise<TripCursor | null> {
    return this.apiReady.then((api) => memTripCursor(api.trips));
  }

  loadTripsForRoute(routeId: Route['route_id']): Promise<TripCursor | null> {
    return this.apiReady.then((api) =>
      memTripCursor(api.trips.filter((trip) => trip.route_id === routeId))
    );
  }

  loadStops(
    stopIds: Iterable<Stop['stop_id']>
  ): Promise<Map<Stop['stop_id'], Stop>> {
    return this.apiReady.then(
      (api) => new Map(unique(stopIds, (stopId) => [stopId, api.stops[stopId]]))
    );
  }

  loadStopsSpatial(): Promise<Stop[]> {
    return this.apiReady.then((api) => Object.values(api.stops));
  }

  loadCalendars(): Promise<Map<Calendar['service_id'], Calendar>> {
    return this.apiReady
      .then(
        (api) =>
          Object.entries(api.calendar) as [Calendar['service_id'], Calendar][]
      )
      .then((entries) => new Map(entries));
  }

  loadAgency(agencyId: Agency['agency_id']): Promise<Agency | undefined> {
    return this.apiReady.then((api) => api.agency[agencyId]);
  }

  searchRoutes(term: string, max: number): Promise<Route[]> {
    return this.apiReady.then((api) =>
      searchArray(
        api.routes,
        max,
        (route) =>
          route.route_short_name.startsWith(term) ||
          route.route_long_name.includes(term)
      )
    );
  }

  searchStops(term: string, max: number): Promise<Stop[]> {
    return this.apiReady.then((api) =>
      searchArray(
        api.stops,
        max,
        (stop) => stop.stop_name.includes(term) || stop.stop_desc.includes(term)
      )
    );
  }
}
