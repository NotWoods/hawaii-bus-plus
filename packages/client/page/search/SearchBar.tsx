import { h } from 'preact';
import type { JSXInternal as JSX } from 'preact/src/jsx';
import searchIcon from '../icons/search.svg';
import { LeadingInputIcon, SearchInput } from './SearchInput';

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
      <LeadingInputIcon src={searchIcon} alt="Search" />
    </form>
  );
}
