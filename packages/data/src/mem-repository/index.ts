import type {
  Agency,
  Calendar,
  GTFSData,
  Route,
  StationInformation,
  Stop,
  Trip,
} from '@hawaii-bus-plus/types';
import { downloadScheduleData } from '../fetch.js';
import type { Repository, TripCursor } from '../repository.js';
import { memoryBatch } from './batch.js';
import { searchArray } from './search.js';
import { memTripCursor } from './trips.js';

export abstract class BaseMemoryRepository implements Repository {
  protected abstract readonly apiReady: Promise<GTFSData>;

  loadAllRoutes(): Promise<readonly Route[]> {
    return this.apiReady.then((api) => Object.values(api.routes));
  }

  loadRoutes(
    routeIds: Iterable<Route['route_id']>,
  ): Promise<Map<Route['route_id'], Route>> {
    return this.apiReady.then((api) => memoryBatch('routes', api, routeIds));
  }

  loadTrip(tripId: Trip['trip_id']): Promise<Trip | undefined> {
    return this.apiReady.then((api) =>
      api.trips.find((trip) => trip.trip_id === tripId),
    );
  }

  loadTrips(): Promise<TripCursor> {
    return this.apiReady.then((api) => memTripCursor(api.trips));
  }

  loadTripsForRoute(routeId: Route['route_id']): Promise<TripCursor> {
    return this.apiReady.then((api) =>
      memTripCursor(api.trips.filter((trip) => trip.route_id === routeId)),
    );
  }

  loadAllStops(): Promise<readonly Stop[]> {
    return this.apiReady.then((api) => Object.values(api.stops));
  }

  loadStops(
    stopIds: Iterable<Stop['stop_id']>,
  ): Promise<Map<Stop['stop_id'], Stop>> {
    return this.apiReady.then((api) => memoryBatch('stops', api, stopIds));
  }

  loadStopsSpatial(): Promise<Stop[]> {
    return this.apiReady.then((api) => Object.values(api.stops));
  }

  loadCalendars(): Promise<Map<Calendar['service_id'], Calendar>> {
    return this.apiReady
      .then(
        (api) =>
          Object.entries(api.calendar) as [Calendar['service_id'], Calendar][],
      )
      .then((entries) => new Map(entries));
  }

  loadAgencies(
    agencyIds: Iterable<Agency['agency_id']>,
  ): Promise<Map<Agency['agency_id'], Agency>> {
    return this.apiReady.then((api) => memoryBatch('agency', api, agencyIds));
  }

  loadBikeStations(): Promise<readonly StationInformation[]> {
    return this.apiReady.then((api) => Object.values(api.bike_stations));
  }

  searchRoutes(term: string, max: number): Promise<Route[]> {
    return this.apiReady.then((api) =>
      searchArray(
        api.routes,
        max,
        (route) =>
          route.route_short_name.startsWith(term) ||
          route.route_long_name.includes(term),
      ),
    );
  }

  searchStops(term: string, max: number): Promise<Stop[]> {
    return this.apiReady.then((api) =>
      searchArray(
        api.stops,
        max,
        (stop) =>
          stop.stop_name.includes(term) || stop.stop_desc.includes(term),
      ),
    );
  }
}

export class MemoryRepository extends BaseMemoryRepository {
  /**
   * @override
   */
  protected readonly apiReady: Promise<GTFSData>;

  constructor() {
    super();
    this.apiReady = this.init();
  }

  private async init(): Promise<GTFSData> {
    const { api } = await downloadScheduleData();
    return api;
  }
}
