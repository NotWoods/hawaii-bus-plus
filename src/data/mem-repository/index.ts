import {
  Calendar,
  GTFSData,
  Route,
  RouteWithTrips,
  Stop,
} from '../../shared/gtfs-types';
import { downloadScheduleData } from '../fetch';
import { Repository } from '../repository';
import { searchArray } from './search';

export class MemoryRepository implements Repository {
  private apiReady!: Promise<GTFSData>;

  constructor() {
    this.init();
  }

  init(): Promise<void> {
    this.apiReady = downloadScheduleData();
    return this.apiReady.then(() => {});
  }

  loadRoute(routeId: Route['route_id']): Promise<RouteWithTrips | undefined> {
    return this.apiReady.then((api) => api.routes[routeId]);
  }

  loadRoutes(): Promise<RouteWithTrips[]> {
    return this.apiReady.then((api) => Object.values(api.routes));
  }

  loadStops(
    stopIds: Iterable<Stop['stop_id']>
  ): Promise<Map<Stop['stop_id'], Stop>> {
    return this.apiReady.then(
      (api) =>
        new Map(Array.from(stopIds, (stopId) => [stopId, api.stops[stopId]]))
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
