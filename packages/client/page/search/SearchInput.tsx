import { h } from 'preact';
import type { JSXInternal as JSX } from 'preact/src/jsx';
import { classNames } from '../hooks/classnames';
import { Icon } from '../icons/Icon';
import '../../all-pages/Input.css';

export const searchInputIconClass = 'absolute inset-y-0 h-full py-0 px-2';
export const leadingInputClass = `${searchInputIconClass} left-0 w-10 opacity-60 filter-invert`;

export function SearchInput(props: JSX.HTMLAttributes<HTMLInputElement>) {
  return (
    <input
      {...props}
      type="search"
      class={classNames(
        'input focus:ring-cyan focus:border-cyan block w-full placeholder-current placeholder-opacity-70 bg-blue-700 text-white sm:text-sm border-gray-300',
        props.class
      )}
    />
  );
}

export function LeadingInputIcon(props: { src: string; alt: string }) {
  return <Icon {...props} class={leadingInputClass} />;
}
