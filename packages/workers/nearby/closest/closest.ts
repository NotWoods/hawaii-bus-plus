import { Repository } from '@hawaii-bus-plus/data';
import { Agency, Route, Stop } from '@hawaii-bus-plus/types';
import type { LatLngLiteral } from 'spherical-geometry-js';
import { findClosestStops, StopWithDistance } from './closest-stops';

export interface ClosestResults {
  stops: readonly Stop[];
  routes: ReadonlyMap<Route['route_id'], Route>;
  agencies: ReadonlyMap<Agency['agency_id'], Agency>;
}

export async function findClosest(
  repo: Pick<
    Repository,
    'loadStopsSpatial' | 'loadAllRoutes' | 'loadRoutes' | 'loadAgencies'
  >,
  location?: LatLngLiteral,
  fallbackToAll?: boolean,
): Promise<ClosestResults> {
  let stops: readonly StopWithDistance[] = [];
  let routeIds: readonly Route['route_id'][] = [];
  if (location) {
    stops = await findClosestStops(repo, location);
    routeIds = stops.flatMap((stop) => stop.routes);
  }

  let routes: ReadonlyMap<Route['route_id'], Route>;
  if (routeIds.length > 0) {
    routes = await repo.loadRoutes(routeIds);
  } else if (fallbackToAll) {
    const all = await repo.loadAllRoutes();
    routes = new Map(all.map((route) => [route.route_id, route]));
  } else {
    routes = new Map();
  }

  const agencyIds = Array.from(routes.values(), (route) => route.agency_id);
  const agencies = await repo.loadAgencies(agencyIds);

  return {
    stops,
    routes,
    agencies,
  };
}
