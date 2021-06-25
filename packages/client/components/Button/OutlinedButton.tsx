import clsx, { ClassValue } from 'clsx';
import { ComponentChildren, h } from 'preact';
import { Icon } from '../../assets/icons/Icon';
import { ButtonOrAnchor } from './ButtonOrAnchor';

interface Props {
  href?: string;
  icon?: string;
  id?: string;
  class?: ClassValue;
  iconClass?: ClassValue;
  children: ComponentChildren;
  onClick?(evt: MouseEvent): void;
}

/**
 * Button styled with a white outline
 */
export function OutlinedButton({ icon, iconClass, ...props }: Props) {
  return (
    <ButtonOrAnchor
      {...props}
      class={clsx(
        'flex p-2 font-medium border border-current hover:bg-red hover:bg-opacity-20 motion-safe:transition-colors',
        props.class,
      )}
    >
      {icon && <Icon class={clsx('mr-2', iconClass)} src={icon} alt="" />}
      {props.children}
    </ButtonOrAnchor>
  );
}
