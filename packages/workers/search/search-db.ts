import type { Repository } from '@hawaii-bus-plus/data';
import type { Agency, Route, Stop } from '@hawaii-bus-plus/types';
import { applyOffset, type SearchRequest } from './helpers';

export interface RouteSearchResult extends Route {
  agency: Agency;
}

export interface StopSearchResult
  extends Pick<Stop, 'stop_id' | 'stop_name' | 'stop_desc'> {
  routes: readonly Route[];
}

export interface SearchResults {
  favorites: readonly unknown[];
  places: readonly google.maps.places.AutocompletePrediction[];
  routes: readonly RouteSearchResult[];
  stops: readonly StopSearchResult[];
}

export function search(
  repo: Pick<
    Repository,
    'loadRoutes' | 'loadAgencies' | 'searchRoutes' | 'searchStops'
  >,
  request: SearchRequest,
): Promise<SearchResults> {
  //const placeSearchReady = getPlacePredictions(request);

  const searchTerm = applyOffset(request.input, request.offset);
  const routeSearchReady = repo
    .searchRoutes(searchTerm, 3)
    .then(async (routes): Promise<RouteSearchResult[]> => {
      const agencyIds = routes.map((route) => route.agency_id);
      const agencies = await repo.loadAgencies(agencyIds);
      return routes.map((route) => ({
        ...route,
        agency: agencies.get(route.agency_id)!,
      }));
    });
  const stopSearchReady = repo
    .searchStops(searchTerm, 3)
    .then(async (stops): Promise<StopSearchResult[]> => {
      const routeIds = new Set(stops.flatMap((stop) => stop.routes));
      const routes = await repo.loadRoutes(routeIds);
      return stops.map((stop) => ({
        stop_id: stop.stop_id,
        stop_name: stop.stop_name,
        stop_desc: stop.stop_desc,
        routes: stop.routes.map((routeId) => routes.get(routeId)!),
      }));
    });

  return Promise.all([
    Promise.resolve([]), // placeSearchReady,
    routeSearchReady,
    stopSearchReady,
  ]).then(([placeSearch, routeSearch, stopSearch]) => {
    return {
      favorites: [],
      places: placeSearch,
      routes: routeSearch,
      stops: stopSearch,
    };
  });
}
