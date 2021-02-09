import { h } from 'preact';
import type { JSXInternal as JSX } from 'preact/src/jsx';
import { IconButton } from '../buttons/IconButton';
import clearIcon from '../icons/clear.svg';
import { IconTw } from '../icons/Icon';
import searchIcon from '../icons/search.svg';

export function SearchBar(props: JSX.HTMLAttributes<HTMLInputElement>) {
  return (
    <form class="relative shadow-sm m-4">
      <input
        {...props}
        type="search"
        class="focus:ring-indigo-500 focus:border-indigo-500 block w-full pl-10 pr-12 sm:text-sm border-gray-300"
        placeholder="Where to?"
        aria-label="Where to?"
        accessKey="f"
      />
      <IconTw
        src={searchIcon}
        alt="Search"
        class="absolute inset-y-0 left-0 h-full py-0 px-2 w-10 opacity-60"
      />
      <IconButton
        type="reset"
        class="absolute inset-y-0 right-0 h-full py-0 px-2"
      >
        <IconTw src={clearIcon} alt="Clear" class="opacity-60" />
      </IconButton>
    </form>
  );
}
