import { useGoogleMap } from '@hawaii-bus-plus/react-google-maps';
import type { SearchWorkerHandler } from '../../../worker-search/search';
import { SearchResults } from '../../../worker-search/search-db';
import SearchWorker from '../../../worker-search/search?worker';
import { databaseInitialized } from '../../hooks/useDatabaseInitialized';
import { usePromise } from '../../hooks/usePromise';
import { useWorker } from '../../hooks/useWorker';
import {
  buildSessionToken,
  emptyResults,
  getPlacePredictions,
} from './places-autocomplete';

export function useSearch(
  query: string,
  onSearchResults: (results: SearchResults) => void
) {
  const map = useGoogleMap();
  const postToSearchWorker = useWorker(SearchWorker) as SearchWorkerHandler;

  usePromise(
    async (signal) => {
      if (!query) onSearchResults(emptyResults);

      const request = { input: query, offset: query.length };
      const gtfsReady = databaseInitialized.then(() =>
        postToSearchWorker(signal, request)
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
      onSearchResults({ ...gtfs, places });
    },
    [query]
  );
}
