import { lazy } from 'preact/compat';
import { useCallback, useEffect, useRef, useState } from 'preact/hooks';
import { directions } from '../../../../assets/icons/paths';
import { OutlinedButton } from '../../../../components/Button/OutlinedButton';
import { usePromise } from '../../../hooks';
import { SnackbarSuspense } from '../../../loading/SnackbarErrorBoundary';
import { SearchBar } from '../SearchBar';
import { useAutocompleteKeys } from '../useAutocompleteKeys';
import { emptyResults } from './places-autocomplete';
import { useSearch } from './useSearch';

interface Props {
  autoFocus?: boolean;
  onDirections?(): void;
}

interface InputEvent {
  currentTarget: { value: string };
}

export const lazySearchResults = () => import('../search-lazy-entry');
const SearchResultsList = lazy(
  async () => (await lazySearchResults()).SearchResultsList,
);

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

  useEffect(() => {
    // prefetch layout
    void lazySearchResults();
  }, []);

  return (
    <>
      <SearchBar
        autoFocus={props.autoFocus}
        inputRef={searchRef}
        value={search}
        onInput={setSearch}
        aria-expanded={searchResults === emptyResults}
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

      {searchResults === emptyResults ? null : (
        <SnackbarSuspense fallback={null}>
          <SearchResultsList
            {...searchResults}
            id="searchResults"
            forceTitles
            onKeyDown={handleKeyDown}
          />
        </SnackbarSuspense>
      )}
    </>
  );
}
