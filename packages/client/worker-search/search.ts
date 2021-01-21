import { Repository } from '@hawaii-bus-plus/data';
import { Route, Stop } from '@hawaii-bus-plus/types';
import { applyOffset } from './helpers';
import { AutocompletionRequest } from './places-autocomplete';

export interface SearchResults {
  places: readonly google.maps.places.AutocompletePrediction[];
  routes: readonly Route[];
  stops: readonly Stop[];
}

export function search(
  repo: Pick<Repository, 'searchRoutes' | 'searchStops'>,
  request: AutocompletionRequest
): Promise<SearchResults> {
  //const placeSearchReady = getPlacePredictions(request);

  const searchTerm = applyOffset(request.input, request.offset);
  const routeSearchReady = repo.searchRoutes(searchTerm, 3);
  const stopSearchReady = repo.searchStops(searchTerm, 3);

  return Promise.all([
    [], // placeSearchReady,
    routeSearchReady,
    stopSearchReady,
  ]).then(([placeSearch, routeSearch, stopSearch]) => {
    return {
      places: placeSearch,
      routes: routeSearch,
      stops: stopSearch,
    };
  });
}
