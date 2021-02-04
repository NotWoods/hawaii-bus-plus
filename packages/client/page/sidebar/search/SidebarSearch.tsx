import { useGoogleMap } from '@hawaii-bus-plus/react-google-maps';
import { h } from 'preact';
import { useState } from 'preact/hooks';
import type { SearchWorkerHandler } from '../../../worker-search/search';
import { SearchResults } from '../../../worker-search/search-db';
import SearchWorker from '../../../worker-search/search?worker';
import { usePromise } from '../../hooks/usePromise';
import { useWorker } from '../../hooks/useWorker';
import { emptyResults, search } from './places-autocomplete';
import { SidebarSearchItems } from './SidebarSearchItems';

interface Props {
  search: string;
}

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

export function SidebarSearch(props: Props) {
  const [searchResults, setSearchResults] = useState(emptyResults);
  useSearch(props.search, setSearchResults);

  return <SidebarSearchItems {...searchResults} forceTitles />;
}
