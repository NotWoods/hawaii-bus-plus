import { h } from 'preact';
import { useState } from 'preact/hooks';
import { emptyResults } from '../../sidebar/search/places-autocomplete';
import { useSearch } from '../../sidebar/search/SidebarSearch';
import { SearchBar } from '../SearchBar';
import { SearchBase } from '../SearchBase';
import { SearchResultsList } from '../items/SearchResultsList';

export function SimpleSearch() {
  const [search, setSearch] = useState('');
  const [searchResults, setSearchResults] = useState(emptyResults);
  useSearch(search, setSearchResults);

  return (
    <SearchBase>
      <SearchBar
        value={search}
        onInput={(evt) => setSearch(evt.currentTarget.value)}
      />
      <SearchResultsList {...searchResults} forceTitles />
    </SearchBase>
  );
}
