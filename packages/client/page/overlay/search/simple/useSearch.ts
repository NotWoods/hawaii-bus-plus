import { AbortError } from '@hawaii-bus-plus/promise-worker';
import { useGoogleMap } from '@hawaii-bus-plus/react-google-maps';
import type {
  SearchWorkerHandler,
  SearchRequest,
} from '../../../../worker-search/worker-search';
import SearchWorker from '../../../../worker-search/worker-search?worker';
import { dbInitialized } from '../../../api';
import { useWorker } from '../../../hooks';
import {
  buildSessionToken,
  emptyResults,
  getPlacePredictions,
} from './places-autocomplete';

async function placePredictions(
  map: google.maps.Map | undefined,
  request: SearchRequest,
) {
  if (!map) return [];

  try {
    return await getPlacePredictions(
      Object.assign({}, request, {
        sessionToken: buildSessionToken(),
        bounds: map.getBounds()!,
        location: map.getCenter(),
        componentRestrictions: { country: 'us' },
      }),
    );
  } catch (err: unknown) {
    console.warn('Google Maps Place Search error', err);
    return [];
  }
}

export function useSearch() {
  const map = useGoogleMap();
  const postToSearchWorker = useWorker(SearchWorker) as SearchWorkerHandler;

  return async function getSearchResults(query: string, signal: AbortSignal) {
    if (!query) {
      return emptyResults;
    }

    const request = { input: query, offset: query.length };
    const gtfsReady = dbInitialized.then(() =>
      postToSearchWorker(signal, request),
    );
    const placesReady = placePredictions(map, request);

    const [places, gtfs] = await Promise.all([placesReady, gtfsReady]);
    if (signal.aborted) {
      throw new AbortError();
    }

    return Object.assign(gtfs, { places });
  };
}
