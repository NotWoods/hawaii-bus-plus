import { h } from 'preact';
import type { JSXInternal as JSX } from 'preact/src/jsx';
import { IconButton } from '../buttons/IconButton';
import clearIcon from '../icons/clear.svg';
import { IconTw } from '../icons/Icon';
import searchIcon from '../icons/search.svg';
import { LeadingInputIcon, SearchInput } from './SearchInput';

export function SearchBar(props: JSX.HTMLAttributes<HTMLInputElement>) {
  return (
    <form class="relative shadow-sm m-4">
      <SearchInput
        {...props}
        class="pl-10 pr-12"
        placeholder="Where to?"
        aria-label="Where to?"
        accessKey="f"
      />
      <LeadingInputIcon src={searchIcon} alt="Search" />
      <IconButton
        type="reset"
        class="absolute inset-y-0 right-0 h-full py-0 px-2"
      >
        <IconTw src={clearIcon} alt="Clear" class="opacity-60" />
      </IconButton>
    </form>
  );
}
