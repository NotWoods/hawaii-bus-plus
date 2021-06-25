import clsx, { ClassValue } from 'clsx';
import { ComponentChildren, h } from 'preact';
import { ButtonOrAnchor } from './ButtonOrAnchor';

interface Props {
  href?: string;
  type?: string;
  id?: string;
  class?: ClassValue;
  children: ComponentChildren;
  onClick?(evt: MouseEvent): void;
}

/**
 * Button styled with a solid background color
 */
export function SolidButton(props: Props) {
  return (
    <ButtonOrAnchor
      {...props}
      class={clsx(
        'motion-safe:transition-colors w-full py-2 px-4 bg-ocean hover:bg-ocean-dark font-medium text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-cyan',
        props.class,
      )}
    >
      {props.children}
    </ButtonOrAnchor>
  );
}
