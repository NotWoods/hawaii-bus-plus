import { h } from 'preact';
import type { JSXInternal as JSX } from 'preact/src/jsx';
import { classNames } from '../hooks/classnames';

interface Props extends JSX.HTMLAttributes<HTMLButtonElement> {
  forceDark?: boolean;
}

export function IconButton({ forceDark: dark, ...props }: Props) {
  const hover = dark
    ? 'text-white hover:bg-white'
    : 'text-black hover:bg-dark dark:text-white dark:hover:bg-white';
  return (
    <button
      type="button"
      {...props}
      class={classNames(
        'rounded-full focus:ring-indigo-500 focus:border-indigo-500 border-transparent hover:bg-opacity-10 transition-colors',
        hover,
        props.class
      )}
    />
  );
}
