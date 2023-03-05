import clsx from 'clsx';
import type { ComponentChildren } from 'preact';
import { Icon } from '../../assets/icons/Icon';

interface Props {
  href?: string;
  icon?: string;
  id?: string;
  class?: string;
  iconClass?: string;
  children: ComponentChildren;
  onClick?(evt: MouseEvent): void;
}

/**
 * Button styled with a white outline
 */
export function OutlinedButton({ icon, iconClass, ...props }: Props) {
  const Button = props.href ? 'a' : 'button';
  return (
    <Button
      type={props.href ? undefined : 'button'}
      {...props}
      class={clsx(
        'flex p-2 font-medium border border-current hover:bg-red hover:bg-opacity-20 motion-safe:transition-colors',
        props.class,
      )}
    >
      {icon && <Icon class={clsx('mr-2', iconClass)} src={icon} alt="" />}
      {props.children}
    </Button>
  );
}
