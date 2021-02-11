import { memoize } from '@hawaii-bus-plus/utils';
import type { SearchResults } from '../../../worker-search/search-db';

export const buildSessionToken = memoize(
  () => new google.maps.places.AutocompleteSessionToken()
);

const buildService = memoize(
  () => new google.maps.places.AutocompleteService()
);

export function getPlacePredictions(
  request: google.maps.places.AutocompletionRequest
) {
  const service = buildService();
  return new Promise<google.maps.places.AutocompletePrediction[]>(
    (resolve, reject) =>
      service.getPlacePredictions(request, (result, status) => {
        switch (status) {
          case google.maps.places.PlacesServiceStatus.OK:
            return resolve(result);
          case google.maps.places.PlacesServiceStatus.ZERO_RESULTS:
            return resolve([]);
          default:
            return reject(status);
        }
      })
  );
}

export const emptyResults: SearchResults = {
  favorites: [],
  places: [],
  routes: [],
  stops: [],
};
