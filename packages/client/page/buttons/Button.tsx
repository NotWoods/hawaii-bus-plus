import clsx, { ClassValue } from 'clsx';
import { ComponentChildren, h } from 'preact';
import { Icon } from '../../assets/icons/Icon';
import { ButtonOrAnchor } from './ButtonOrAnchor';
import { useFocusTrapped } from './FocusTrap';

interface Props {
  href?: string;
  icon?: string;
  id?: string;
  class?: ClassValue;
  iconClass?: ClassValue;
  children: ComponentChildren;
  onClick?(evt: MouseEvent): void;
}

export function Button({ icon, iconClass, ...props }: Props) {
  const trapped = useFocusTrapped();
  return (
    <ButtonOrAnchor
      {...props}
      tabIndex={trapped ? -1 : 0}
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
