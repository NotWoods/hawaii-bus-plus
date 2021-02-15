import { ComponentChildren, h } from 'preact';
import { classNames } from '../hooks/classnames';
import { Icon } from '../icons/Icon';
import { ButtonOrAnchor } from './ButtonOrAnchor';

interface Props {
  href?: string;
  icon?: string;
  class?: string;
  iconClass?: string;
  children: ComponentChildren;
  onClick?(evt: MouseEvent): void;
}

export function Button({ icon, iconClass, ...props }: Props) {
  return (
    <ButtonOrAnchor
      {...props}
      class={classNames(
        'flex p-2 font-medium border hover:bg-red hover:bg-opacity-20 transition-colors',
        props.class
      )}
    >
      {icon && <Icon class={classNames('mr-2', iconClass)} src={icon} alt="" />}
      {props.children}
    </ButtonOrAnchor>
  );
}
