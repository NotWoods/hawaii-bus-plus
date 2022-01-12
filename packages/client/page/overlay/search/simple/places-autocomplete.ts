import { memoize } from '@hawaii-bus-plus/utils';
import type { ClosestResults } from '@hawaii-bus-plus/workers/nearby';
import type { SearchResults } from '@hawaii-bus-plus/workers/search';

declare global {
  namespace google.maps.places {
    interface AutocompleteService {
      /**
       * Retrieves place autocomplete predictions based on the supplied
       * autocomplete request. <aside class="note">Note: <strong>For the beta
       * release, <code>v=beta</code>, the callback is optional and a Promise is
       * returned</strong>. More information is available in the <a
       * href="https://developers.google.com/maps/documentation/javascript/promises">Promises
       * guide</a>.</aside>
       */
      getPlacePredictions(
        request: google.maps.places.AutocompletionRequest,
        callback: (
          a: google.maps.places.AutocompletePrediction[] | null,
          b: google.maps.places.PlacesServiceStatus,
        ) => void,
      ): null;
      getPlacePredictions(
        request: google.maps.places.AutocompletionRequest,
      ): Promise<google.maps.places.AutocompleteResponse>;
    }
  }
}

export const buildSessionToken = memoize(
  () => new google.maps.places.AutocompleteSessionToken(),
);

const buildService = memoize(
  () => new google.maps.places.AutocompleteService(),
);

export function getPlacePredictions(
  request: google.maps.places.AutocompletionRequest,
) {
  const service = buildService();
  return new Promise<google.maps.places.AutocompletePrediction[]>(
    (resolve, reject) =>
      service.getPlacePredictions(request, (result, status) => {
        switch (status) {
          case google.maps.places.PlacesServiceStatus.OK:
            return resolve(result!);
          case google.maps.places.PlacesServiceStatus.ZERO_RESULTS:
            return resolve([]);
          default:
            return reject(status);
        }
      }),
  );
}

export const emptyResults: SearchResults = {
  favorites: [],
  places: [],
  routes: [],
  stops: [],
};

export const emptyClosestResults: ClosestResults = {
  stops: [],
  routes: new Map(),
  agencies: new Map(),
};
