import { ComponentChildren, h } from 'preact';
import type { JSXInternal as JSX } from 'preact/src/jsx';
import { classNames } from '../hooks/classnames';
import { IconTw } from '../icons/Icon';

interface Props extends JSX.HTMLAttributes<HTMLButtonElement> {
  icon: string;
  iconClass?: string;
  children: ComponentChildren;
}

export function Button({ icon, iconClass, ...props }: Props) {
  return (
    <button
      type="button"
      {...props}
      class={classNames('flex p-2 border', props.class)}
    >
      <IconTw class={classNames('mr-2', iconClass)} src={icon} alt="" />
      {props.children}
    </button>
  );
}

interface PropsLink extends JSX.HTMLAttributes<HTMLAnchorElement> {
  href: string;
  icon: string;
  iconClass?: string;
  children: ComponentChildren;
}

export function ButtonLink({ icon, iconClass, ...props }: PropsLink) {
  return (
    <a {...props} class={classNames('flex p-2 border', props.class)}>
      <IconTw class={classNames('mr-2', iconClass)} src={icon} alt="" />
      {props.children}
    </a>
  );
}
