import { h } from 'preact';
import { useState } from 'preact/hooks';
import { Button } from '../../buttons/Button';
import directionsIcon from '../../icons/directions.svg';
import { SearchResultsList } from '../items/SearchResultsList';
import { SearchBar } from '../SearchBar';
import { SearchBase } from '../SearchBase';
import { emptyResults } from './places-autocomplete';
import { useSearch } from './useSearch';

interface Props {
  onClose?(): void;
  onDirections?(): void;
}

export function SimpleSearch(props: Props) {
  const [search, setSearch] = useState('');
  const [searchResults, setSearchResults] = useState(emptyResults);
  useSearch(search, setSearchResults);

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

      {searchResults === emptyResults ? null : (
        <SearchResultsList {...searchResults} forceTitles />
      )}
    </SearchBase>
  );
}
