import clsx, { ClassValue } from 'clsx';
import { ComponentChildren, h } from 'preact';

interface Props {
  src: string;
  alt: string;
  class?: string;
  className?: string;
  small?: boolean;
  style?: { gridArea?: string };
}

export function Icon(props: Props) {
  return (
    <img
      class={props.class ?? 'w-6 h-6'}
      style={props.style}
      src={props.src}
      alt={props.alt}
      width="24"
      height="24"
    />
  );
}

export function BaseIcon(props: {
  children: ComponentChildren;
  class?: ClassValue;
  fillBlack?: boolean;
}) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      class={clsx('w-6 h-6', { 'fill-current': !props.fillBlack }, props.class)}
      width="24px"
      height="24px"
    >
      {props.children}
    </svg>
  );
}
