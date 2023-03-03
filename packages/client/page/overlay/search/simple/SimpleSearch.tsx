import { memoize } from '@hawaii-bus-plus/utils';

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

interface InputEvent {
  currentTarget: { value: string };
}

export const lazySearchResults = memoize(() => import('../search-lazy-entry'));

function useInput(): [string, (event: InputEvent) => void] {
  const [input, setInput] = useState('');

  const handleInput = useCallback(
    (event: InputEvent) => setInput(event.currentTarget.value),
    [],
  );

  return [input, handleInput];
}

function useSearchResults(search: string) {
  const [searchResults, setSearchResults] = useState(emptyResults);
  const getSearchResults = useSearch();

  usePromise(
    async (signal) => {
      setSearchResults(await getSearchResults(search, signal));
    },
    [search],
  );

  return searchResults;
}

export function SimpleSearch(props: Props) {
  const [search, setSearch] = useInput();
  const searchResults = useSearchResults(search);
  const searchRef = useRef<HTMLInputElement>(null);
  const handleKeyDown = useAutocompleteKeys(searchRef);
  const { SearchResultsList } = useLazyComponent(lazySearchResults);

  return (
    <>
      <SearchBar
        inputRef={searchRef}
        value={search}
        onInput={setSearch}
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
