import { h } from 'preact';
import type { JSXInternal as JSX } from 'preact/src/jsx';
import { classNames } from '../hooks/classnames';
import { Icon } from '../icons/Icon';

export const searchInputIconClass = 'absolute inset-y-0 h-full py-0 px-2';

export function SearchInput(props: JSX.HTMLAttributes<HTMLInputElement>) {
  return (
    <input
      {...props}
      type="search"
      class={classNames(
        'focus:ring-indigo-500 focus:border-indigo-500 block w-full text-black sm:text-sm border-gray-300',
        props.class
      )}
    />
  );
}

export function LeadingInputIcon(props: { src: string; alt: string }) {
  return (
    <Icon {...props} class={`${searchInputIconClass} left-0 w-10 opacity-60`} />
  );
}
