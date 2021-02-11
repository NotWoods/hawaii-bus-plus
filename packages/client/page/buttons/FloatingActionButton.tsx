import { h } from 'preact';
import type { JSXInternal as JSX } from 'preact/src/jsx';
import { classNames } from '../hooks/classnames';

interface Props extends JSX.HTMLAttributes<HTMLButtonElement> {
  mini?: boolean;
}

export function FloatingActionButton({ mini, ...props }: Props) {
  return (
    <button
      type="button"
      {...props}
      class={classNames(
        'rounded-full shadow-lg focus:ring-indigo-500 focus:border-indigo-500 border-transparent bg-blue-600 hover:bg-blue-700 transition-colors',
        mini ? 'p-2' : 'p-4',
        props.class
      )}
    />
  );
}
