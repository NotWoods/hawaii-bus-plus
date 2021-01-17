import { Route, Stop } from '../shared/gtfs-types';
import { fuseRoutes, fuseStops } from './gtfs-search';
import { AutocompletionRequest } from './places-autocomplete';

export interface SearchResults {
  places: google.maps.places.AutocompletePrediction[];
  routes: Route[];
  stops: Stop[];
}

export function search(request: AutocompletionRequest): Promise<SearchResults> {
  //const placeSearchReady = getPlacePredictions(request);
  const placeSearchReady = Promise.resolve([]);

  const routeSearch = fuseRoutes.search(request);
  const stopSearch = fuseStops.search(request);

  return placeSearchReady.then((placeSearch) => {
    return {
      places: placeSearch,
      routes: routeSearch.map((result) => result.item),
      stops: stopSearch.map((result) => result.item),
    };
  });
}
