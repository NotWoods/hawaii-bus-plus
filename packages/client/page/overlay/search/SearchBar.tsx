import clsx from 'clsx';
import { h } from 'preact';
import type { JSXInternal as JSX } from 'preact/src/jsx';
import { SearchIcon } from '../../icons/MenuIcon';
import {
  leadingInputClass,
  SearchInput,
  searchInputClass,
} from './SearchInput';

export function SearchBar(props: JSX.HTMLAttributes<HTMLInputElement>) {
  return (
    <form class="relative shadow-sm m-4">
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

export function SearchBarButton(props: JSX.HTMLAttributes<HTMLButtonElement>) {
  return (
    <div class="relative shadow-sm m-4">
      <button
        {...props}
        type="button"
        class={clsx(
          'pl-10 py-2 border text-left text-opacity-30',
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
