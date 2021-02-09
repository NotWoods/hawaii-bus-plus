import { useGoogleMap } from '@hawaii-bus-plus/react-google-maps';
import type { SearchWorkerHandler } from '../../../worker-search/search';
import { SearchResults } from '../../../worker-search/search-db';
import SearchWorker from '../../../worker-search/search?worker';
import { usePromise } from '../../hooks/usePromise';
import { useWorker } from '../../hooks/useWorker';
import { search } from './places-autocomplete';

export function useSearch(
  query: string,
  onSearchResults: (results: SearchResults) => void
) {
  const map = useGoogleMap();
  const postToSearchWorker = useWorker(SearchWorker) as SearchWorkerHandler;

  usePromise(async () => {
    const results = await search(map, postToSearchWorker, {
      input: query,
      offset: query.length,
    });

    onSearchResults(results);
  }, [query]);
}
