import { memoize } from '@hawaii-bus-plus/utils';
import { h } from 'preact';
import { useState } from 'preact/hooks';
import { Button } from '../../buttons/Button';
import { useLazyComponent } from '../../hooks/useLazyComponent';
import directionsIcon from '../../icons/directions.svg';
import { SearchBar } from '../SearchBar';
import { SearchBase } from '../SearchBase';
import { emptyResults } from './places-autocomplete';
import { useSearch } from './useSearch';

interface Props {
  onClose?(): void;
  onDirections?(): void;
}

export const lazySearchResults = memoize(() => import('../search-lazy-entry'));

export function SimpleSearch(props: Props) {
  const [search, setSearch] = useState('');
  const [searchResults, setSearchResults] = useState(emptyResults);
  useSearch(search, setSearchResults);
  const { SearchResultsList } = useLazyComponent(lazySearchResults);

  return (
    <SearchBase title="Search" onClose={props.onClose}>
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
    </SearchBase>
  );
}
