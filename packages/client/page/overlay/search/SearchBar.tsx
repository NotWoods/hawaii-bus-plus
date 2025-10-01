import clsx from 'clsx';

import type { HTMLAttributes } from 'preact';
import { SearchIcon } from '../../../assets/icons/MenuIcon';
import {
  leadingInputClass,
  SearchInput,
  searchInputClass,
  type SearchProps,
} from './SearchInput';

export function SearchBar(props: SearchProps) {
  return (
    <form class="relative shadow-xs m-4">
      <SearchInput
        {...props}
        class="pl-10"
        placeholder="Where to?"
        aria-label="Where to?"
        accessKey="f"
      />
      <SearchIcon class={leadingInputClass} />
    </form>
  );
}

export function SearchBarButton(props: HTMLAttributes<HTMLButtonElement>) {
  return (
    <div class="relative shadow-xs m-4">
      <button
        {...props}
        type="button"
        class={clsx(
          'pl-10 py-2 border text-left text-white/30',
          searchInputClass,
        )}
        accessKey="f"
      >
        Where to?
        <SearchIcon class={leadingInputClass} />
      </button>
    </div>
  );
}
