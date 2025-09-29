import clsx from 'clsx';
import type { ButtonHTMLAttributes } from 'preact';
import { forwardRef } from 'preact/compat';

interface Props extends ButtonHTMLAttributes<HTMLButtonElement> {
  title?: string;
  forceDark?: boolean;
}

/**
 * A button that only displays an icon.
 */
export const IconButton = forwardRef<HTMLButtonElement, Props>(
  function IconButton({ forceDark, ...props }) {
    const hover = forceDark
      ? 'text-white bg-white/0 hover:bg-white/10'
      : 'text-black bg-dark/0 dark:text-white dark:bg-white/0 hover:bg-dark/0 dark:hover:bg-white/10';
    return (
      <button
        type="button"
        aria-label={props.title}
        {...props}
        class={clsx(
          'block shrink-0 rounded-full w-12 h-12 p-3 focus:ring-cyan focus:border-cyan border-transparent motion-safe:transition-colors',
          props.disabled ? 'cursor-default' : hover,
          props.class,
        )}
      />
    );
  },
);
