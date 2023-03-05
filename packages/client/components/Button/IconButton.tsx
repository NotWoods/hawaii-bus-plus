import clsx from 'clsx';
import type { JSX } from 'preact';
import { forwardRef } from 'preact/compat';

interface Props extends JSX.HTMLAttributes<HTMLButtonElement> {
  forceDark?: boolean;
}

/**
 * A button that only displays an icon.
 */
export const IconButton = forwardRef<HTMLButtonElement, Props>(
  function IconButton({ forceDark, ...props }) {
    const hover = forceDark
      ? 'text-white bg-white'
      : 'text-black bg-dark dark:text-white dark:bg-white';
    return (
      <button
        type="button"
        {...props}
        class={clsx(
          'block flex-shrink-0 rounded-full w-12 h-12 p-3 focus:ring-cyan focus:border-cyan border-transparent bg-opacity-0 dark:bg-opacity-0 hover:bg-opacity-10 motion-safe:transition-colors',
          props.disabled ? 'cursor-default' : hover,
          props.class,
        )}
      />
    );
  },
);
