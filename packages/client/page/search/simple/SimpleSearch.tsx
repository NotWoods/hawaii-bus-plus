import { memoize } from '@hawaii-bus-plus/utils';
import { h, Fragment } from 'preact';
import { useState } from 'preact/hooks';
import { Button } from '../../buttons/Button';
import { useLazyComponent } from '../../hooks/useLazyComponent';
import { usePromise } from '../../hooks/usePromise';
import directionsIcon from '../../icons/directions.svg';
import { SearchBar } from '../SearchBar';
import { emptyResults } from './places-autocomplete';
import { useSearch } from './useSearch';

interface Props {
  onDirections?(): void;
}

export const lazySearchResults = memoize(() => import('../search-lazy-entry'));

export function SimpleSearch(props: Props) {
  const [search, setSearch] = useState('');
  const [searchResults, setSearchResults] = useState(emptyResults);
  const getSearchResults = useSearch();
  const { SearchResultsList } = useLazyComponent(lazySearchResults);

  usePromise(
    async (signal) => {
      setSearchResults(await getSearchResults(search, signal));
    },
    [search]
  );

  return (
    <>
      <SearchBar
        value={search}
        onInput={(evt) => setSearch(evt.currentTarget.value)}
      />
      <Button
        icon={directionsIcon}
        class="mx-4 mb-4"
        iconClass="filter-invert"
        onClick={props.onDirections}
      >
        Directions
      </Button>

      {!SearchResultsList || searchResults === emptyResults ? null : (
        <SearchResultsList {...searchResults} forceTitles />
      )}
    </>
  );
}
