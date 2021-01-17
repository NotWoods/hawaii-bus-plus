import { dbReady } from '../data/database';
import { searchWordsIndex } from '../data/search-db';
import { Route, Stop } from '../shared/gtfs-types';
import { applyOffset } from './helpers';
import { AutocompletionRequest } from './places-autocomplete';

export interface SearchResults {
  places: readonly google.maps.places.AutocompletePrediction[];
  routes: readonly Route[];
  stops: readonly Stop[];
}

export function search(request: AutocompletionRequest): Promise<SearchResults> {
  //const placeSearchReady = getPlacePredictions(request);

  const searchTerm = applyOffset(request.input, request.offset);
  const routeSearchReady = dbReady.then((db) => {
    const { store } = db.transaction('routes');
    return searchWordsIndex<Route>(store, searchTerm, 3);
  });
  const stopSearchReady = dbReady.then((db) => {
    const { store } = db.transaction('stops');
    return searchWordsIndex<Stop>(store, searchTerm, 3);
  });

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
