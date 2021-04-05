import { useGoogleMap } from '@hawaii-bus-plus/react-google-maps';
import type { SearchWorkerHandler } from '../../../worker-search/search';
import SearchWorker from '../../../worker-search/search?worker';
import { useWorker } from '../../hooks';
import { dbInitialized } from '../../hooks/api';
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
    return { ...gtfs, places };
  };
}
