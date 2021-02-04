import { Repository } from '@hawaii-bus-plus/data';
import { Route, Stop } from '@hawaii-bus-plus/types';
import { applyOffset, SearchRequest } from './helpers';

export interface StopSearchResult extends Pick<Stop, 'stop_id' | 'stop_name'> {
  routes: Route[];
}

export interface SearchResults {
  favorites: readonly unknown[];
  places: readonly google.maps.places.AutocompletePrediction[];
  routes: readonly Route[];
  stops: readonly StopSearchResult[];
}

export function search(
  repo: Pick<Repository, 'loadRoutes' | 'searchRoutes' | 'searchStops'>,
  request: SearchRequest
): Promise<SearchResults> {
  //const placeSearchReady = getPlacePredictions(request);

  const searchTerm = applyOffset(request.input, request.offset);
  const routeSearchReady = repo.searchRoutes(searchTerm, 3);
  const stopSearchReady = repo.searchStops(searchTerm, 3).then(
    async (stops): Promise<StopSearchResult[]> => {
      const routeIds = new Set(stops.flatMap((stop) => stop.routes));
      const routes = await repo.loadRoutes(routeIds);
      return stops.map((stop) => ({
        stop_id: stop.stop_id,
        stop_name: stop.stop_name,
        routes: stop.routes.map((routeId) => routes.get(routeId)!),
      }));
    }
  );

  return Promise.all([
    [], // placeSearchReady,
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
