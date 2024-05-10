import clsx from 'clsx';
import type { JSX } from 'preact';

interface Props extends JSX.HTMLAttributes<HTMLButtonElement> {
  mini?: boolean;
}

export function FloatingActionButton({ mini, ...props }: Props) {
  return (
    <button
      type="button"
      aria-label={props.title}
      {...props}
      class={clsx(
        'group text-white focus:ring-cyan',
        mini ? 'p-2' : 'p-4',
        props.class,
      )}
    >
      <div class="absolute inset-0 bg-primary-500 group-hover:bg-primary-600 motion-safe:transition-colors rotate-45 shadow-lg" />
      {props.children}
    </button>
  );
}
