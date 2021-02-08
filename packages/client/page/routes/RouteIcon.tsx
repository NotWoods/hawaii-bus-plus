import { ComponentChildren, h } from 'preact';
import { classNames } from '../hooks/classnames';
import './RouteIcon.css';

interface Props {
  children: ComponentChildren;
  class?: string;
  title?: string;
  style?: {
    [key: string]: string | number | null | undefined;
  };
}

export function RouteIcon(props: Props) {
  return (
    <span
      {...props}
      class={classNames(
        'route__icon block text-lg w-10 font-display text-center relative',
        props.class
      )}
    >
      {props.children}
    </span>
  );
}
