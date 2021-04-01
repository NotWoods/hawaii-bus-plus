import { Repository } from '@hawaii-bus-plus/data';
import { Route, Stop, Trip } from '@hawaii-bus-plus/types';
import { withAppName } from '../all-pages/components/PageTitle';

const ROUTES_PREFIX = '/share/routes/';

export function urlToRouteId(url: URL): Route['route_id'] {
  if (url.pathname.startsWith(ROUTES_PREFIX)) {
    // If link opens route
    const [routeId] = url.pathname.slice(ROUTES_PREFIX.length).split('/');
    return routeId as Route['route_id'];
  } else if (url.searchParams.get('route')) {
    return url.searchParams.get('route') as Route['route_id'];
  } else {
    throw new Error(`Invalid URL ${url.pathname}`);
  }
}

export async function loadRoute(repo: Repository, routeId: Route['route_id']) {
  const routesReady = repo.loadRoutes([routeId]);
  const stopIds = new Set<Stop['stop_id']>();
  const trips: Trip[] = [];

  let cursor = await repo.loadTripsForRoute(routeId);
  while (cursor) {
    trips.push(cursor.value);
    for (const stopTime of cursor.value.stop_times) {
      stopIds.add(stopTime.stop_id);
    }
    cursor = await cursor.continue();
  }

  const stopsReady = repo.loadStops(stopIds);

  const routes = await routesReady;
  const route = routes.get(routeId);
  if (!route) {
    throw new Error(`Could not find data for route ID ${routeId}`);
  }

  const agencies = await repo.loadAgencies([route.agency_id]);
  const agency = agencies.get(route.agency_id)!;
  const stops = await stopsReady;

  return { route, trips, agency, stops };
}

export function renderTitle(route: Route) {
  return withAppName(`${route.route_short_name} · ${route.route_long_name}`);
}
