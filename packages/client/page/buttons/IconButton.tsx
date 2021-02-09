import { h } from 'preact';
import type { JSXInternal as JSX } from 'preact/src/jsx';
import { classNames } from '../hooks/classnames';

interface Props extends JSX.HTMLAttributes<HTMLButtonElement> {
  dark?: boolean;
}

export function IconButton({ dark, ...props }: Props) {
  const hover = dark
    ? 'text-white hover:bg-gray-50'
    : 'text-black hover:bg-gray-900';
  return (
    <button
      type="button"
      {...props}
      class={classNames(
        'rounded-full focus:ring-indigo-500 focus:border-indigo-500 border-transparent hover:bg-opacity-20',
        hover,
        props.class
      )}
    />
  );
}
