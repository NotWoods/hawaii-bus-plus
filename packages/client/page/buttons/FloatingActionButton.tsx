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
        'rounded-full shadow-lg focus:ring-cyan focus:border-cyan border-transparent bg-blue-500 hover:bg-blue-600 transition-colors',
        mini ? 'p-2' : 'p-4',
        props.class
      )}
    />
  );
}
