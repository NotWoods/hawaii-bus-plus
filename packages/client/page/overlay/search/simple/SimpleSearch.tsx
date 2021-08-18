import { memoize } from '@hawaii-bus-plus/utils';
import { Fragment, h } from 'preact';
import { useCallback, useRef, useState } from 'preact/hooks';
import { directions } from '../../../../assets/icons/paths';
import { OutlinedButton } from '../../../../components/Button/OutlinedButton';
import { useLazyComponent, usePromise } from '../../../hooks';
import { SearchBar } from '../SearchBar';
import { useAutocompleteKeys } from '../useAutocompleteKeys';
import { emptyResults } from './places-autocomplete';
import { useSearch } from './useSearch';

interface Props {
  onDirections?(): void;
}

export const lazySearchResults = memoize(() => import('../search-lazy-entry'));

export function SimpleSearch(props: Props) {
  const [search, setSearch] = useState('');
  const [searchResults, setSearchResults] = useState(emptyResults);
  const searchRef = useRef<HTMLInputElement>();
  const getSearchResults = useSearch();
  const getRef = useCallback(() => searchRef.current, []);
  const handleKeyDown = useAutocompleteKeys(getRef);
  const { SearchResultsList } = useLazyComponent(lazySearchResults);

  usePromise(
    async (signal) => {
      setSearchResults(await getSearchResults(search, signal));
    },
    [search],
  );

  return (
    <>
      <SearchBar
        inputRef={searchRef}
        value={search}
        onInput={(evt) => setSearch(evt.currentTarget.value)}
        aria-expanded={(searchResults === emptyResults).toString()}
        aria-owns="searchResults"
        onKeyDown={handleKeyDown}
      />
      <OutlinedButton
        icon={directions}
        class="mx-4 mb-4"
        iconClass="invert"
        onClick={props.onDirections}
      >
        Directions
      </OutlinedButton>

      {!SearchResultsList || searchResults === emptyResults ? null : (
        <SearchResultsList
          {...searchResults}
          id="searchResults"
          forceTitles
          onKeyDown={handleKeyDown}
        />
      )}
    </>
  );
}
