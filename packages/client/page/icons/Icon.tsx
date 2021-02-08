import { ComponentChildren, h } from 'preact';
import { classNames } from '../hooks/classnames';
import './Icon.css';

interface Props {
  src: string;
  alt: string;
  class?: string;
  className?: string;
  small?: boolean;
}

export function IconTw(props: Props) {
  return (
    <img
      class={props.class ?? 'w-6 h-6'}
      src={props.src}
      alt={props.alt}
      width="24"
      height="24"
    />
  );
}

export function BaseIcon(props: { children: ComponentChildren }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      class="fill-current w-6 h-6"
      width="24px"
      height="24px"
    >
      {props.children}
    </svg>
  );
}

export function Icon(props: Props) {
  return (
    <img
      className={classNames(
        'icon inline-block m-0',
        props.small ? 'align-baseline w-6 h-6' : 'w-8 h-8',
        props.className
      )}
      src={props.src}
      alt={props.alt}
      width="24"
      height="24"
    />
  );
}
