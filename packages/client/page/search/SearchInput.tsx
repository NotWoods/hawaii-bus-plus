import clsx from 'clsx';
import { h } from 'preact';
import type { JSXInternal as JSX } from 'preact/src/jsx';
import '../../all-pages/Input.css';
import { Icon } from '../icons/Icon';

export const searchInputIconClass = 'absolute inset-y-0 h-full py-0 px-2';
export const leadingInputClass = `${searchInputIconClass} left-0 w-10 opacity-60 filter invert`;

export const searchInputClass =
  'focus:ring-cyan focus:border-cyan block w-full bg-primary-700 text-white sm:text-sm border-gray-300';

export function SearchInput(props: JSX.HTMLAttributes<HTMLInputElement>) {
  return (
    <input
      {...props}
      type="search"
      class={clsx(
        'input placeholder-current placeholder-opacity-70',
        searchInputClass,
        props.class,
      )}
    />
  );
}

export function LeadingInputIcon(props: { src: string; alt: string }) {
  return <Icon {...props} class={leadingInputClass} />;
}
