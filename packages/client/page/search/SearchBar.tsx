import { h } from 'preact';
import type { JSXInternal as JSX } from 'preact/src/jsx';
import { SearchIcon } from '../icons/MenuIcon';
import { leadingInputClass, SearchInput } from './SearchInput';

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
