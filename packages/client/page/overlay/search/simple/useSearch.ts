import { AbortError } from '@hawaii-bus-plus/promise-worker';
import { useGoogleMap } from '@hawaii-bus-plus/react-google-maps';
import type { SearchWorkerHandler } from '../../../../worker-search/worker-search';
import SearchWorker from '../../../../worker-search/worker-search?worker';
import { dbInitialized } from '../../../api';
import { useWorker } from '../../../hooks';
import {
  buildSessionToken,
  emptyResults,
  getPlacePredictions,
} from './places-autocomplete';

export function useSearch() {
  const map = useGoogleMap();
  const postToSearchWorker = useWorker(SearchWorker) as SearchWorkerHandler;

  return async function getSearchResults(query: string, signal: AbortSignal) {
    if (!query) {
      return emptyResults;
    }

    const request = { input: query, offset: query.length };
    const gtfsReady = dbInitialized.then(() =>
      postToSearchWorker(signal, {
        ...request,
        type: 'search',
      }),
    );
    const placesReady = map
      ? getPlacePredictions({
          ...request,
          sessionToken: buildSessionToken(),
          bounds: map.getBounds()!,
          location: map.getCenter(),
          componentRestrictions: { country: 'us' },
        })
      : [];

    const [places, gtfs] = await Promise.all([placesReady, gtfsReady]);
    if (signal.aborted) {
      throw new AbortError();
    }

    return Object.assign(gtfs, { places });
  };
}
