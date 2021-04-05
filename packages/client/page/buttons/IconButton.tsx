import clsx from 'clsx';
import { h } from 'preact';
import type { JSXInternal as JSX } from 'preact/src/jsx';

interface Props extends JSX.HTMLAttributes<HTMLButtonElement> {
  forceDark?: boolean;
}

export function IconButton({ forceDark: dark, ...props }: Props) {
  const hover = dark
    ? 'text-white bg-white'
    : 'text-black bg-dark dark:text-white dark:bg-white';
  return (
    <button
      type="button"
      {...props}
      class={clsx(
        'block flex-shrink-0 rounded-full focus:ring-cyan focus:border-cyan border-transparent bg-opacity-0 dark:bg-opacity-0 hover:bg-opacity-10 transition-colors',
        props.disabled ? 'cursor-default' : hover,
        props.class,
      )}
    />
  );
}
