import clsx from 'clsx';
import type { ComponentChildren } from 'preact';

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
  class?: string;
  fillBlack?: boolean;
}) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      class={clsx(
        'box-content w-6',
        {
          'h-6': !props.class?.includes('h-'),
          'fill-current': !props.fillBlack,
        },
        props.class,
      )}
      width="24px"
      height="24px"
    >
      {props.children}
    </svg>
  );
}
