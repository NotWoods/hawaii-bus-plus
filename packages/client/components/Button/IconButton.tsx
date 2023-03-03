import clsx from 'clsx';

import type { JSX } from 'preact';

interface Props extends JSX.HTMLAttributes<HTMLButtonElement> {
  forceDark?: boolean;
}

/**
 * A button that only displays an icon.
 */
export function IconButton({ forceDark, ...props }: Props) {
  const hover = forceDark
    ? 'text-white bg-white'
    : 'text-black bg-dark dark:text-white dark:bg-white';
  return (
    <button
      type="button"
      {...props}
      class={clsx(
        'block flex-shrink-0 rounded-full focus:ring-cyan focus:border-cyan border-transparent bg-opacity-0 dark:bg-opacity-0 hover:bg-opacity-10 motion-safe:transition-colors',
        props.disabled ? 'cursor-default' : hover,
        props.class,
      )}
    />
  );
}
