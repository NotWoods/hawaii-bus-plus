import clsx from 'clsx';
import { h } from 'preact';
import type { JSXInternal as JSX } from 'preact/src/jsx';

interface Props extends JSX.HTMLAttributes<HTMLButtonElement> {
  mini?: boolean;
}

export function FloatingActionButton({ mini, ...props }: Props) {
  return (
    <button
      type="button"
      {...props}
      class={clsx(
        'group text-white focus:ring-cyan',
        mini ? 'p-2' : 'p-4',
        props.class
      )}
    >
      <div class="absolute inset-0 bg-blue-500 group-hover:bg-blue-600 transition-colors transform rotate-45 shadow-lg" />
      {props.children}
    </button>
  );
}
