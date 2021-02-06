import { ComponentChildren, h } from 'preact';
import { classNames } from '../hooks/classnames';
import './link/RouteListItem.css';

interface Props {
  children: ComponentChildren;
  class?: string;
  style?: {
    [key: string]: string | number | null | undefined;
  };
}

export function RouteIcon(props: Props) {
  return (
    <span style={props.style} class={classNames('route__icon', props.class)}>
      {props.children}
    </span>
  );
}
