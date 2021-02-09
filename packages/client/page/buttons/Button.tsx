import { ComponentChildren, h } from 'preact';
import type { JSXInternal as JSX } from 'preact/src/jsx';
import { classNames } from '../hooks/classnames';
import { IconTw } from '../icons/Icon';

interface Props extends JSX.HTMLAttributes<HTMLButtonElement> {
  icon: string;
  children: ComponentChildren;
}

export function Button({ icon, ...props }: Props) {
  return (
    <button
      type="button"
      {...props}
      class={classNames('flex p-2 border', props.class)}
    >
      <IconTw class="filter-invert mr-2" src={icon} alt="" />
      {props.children}
    </button>
  );
}
