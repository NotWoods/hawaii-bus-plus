import { memoize } from '@hawaii-bus-plus/utils';
import type { SearchWorkerHandler } from '../../../worker-search';
import type { SearchRequest } from '../../../worker-search/helpers';
import type { SearchResults } from '../../../worker-search/search-db';
import { databaseInitialized } from '../../hooks/useDatabaseInitialized';

export const buildSessionToken = memoize(
  () => new google.maps.places.AutocompleteSessionToken()
);

const buildService = memoize(
  () => new google.maps.places.AutocompleteService()
);

function getPlacePredictions(
  request: google.maps.places.AutocompletionRequest
) {
  const service = buildService();
  return new Promise<google.maps.places.AutocompletePrediction[]>(
    (resolve, reject) =>
      service.getPlacePredictions(request, (result, status) => {
        switch (status) {
          case google.maps.places.PlacesServiceStatus.OK:
            return resolve(result);
          default:
            return reject(status);
        }
      })
  );
}

export const emptyResults: SearchResults = {
  places: [],
  routes: [],
  stops: [],
};

export async function search(
  map: google.maps.Map | null | undefined,
  postMessage: SearchWorkerHandler,
  request: SearchRequest
): Promise<SearchResults> {
  const [places, gtfs] = await Promise.all([
    map
      ? getPlacePredictions({
          ...request,
          sessionToken: buildSessionToken(),
          bounds: map.getBounds()!,
          location: map.getCenter(),
          componentRestrictions: {
            country: 'us',
          },
        })
      : [],
    databaseInitialized.then(() => postMessage(request)),
  ]);

  return { ...gtfs, places };
}
