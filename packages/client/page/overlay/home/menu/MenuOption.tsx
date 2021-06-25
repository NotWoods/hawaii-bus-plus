import { ComponentChildren, h } from 'preact';
import { ButtonOrAnchor } from '../../../../components/Button/ButtonOrAnchor';
import { Icon } from '../../../../assets/icons/Icon';

interface Props {
  children: ComponentChildren;
  icon: string;
  href?: string;
  onClick?(evt: MouseEvent): void;
}

export function MenuOption(props: Props) {
  return (
    <ButtonOrAnchor
      href={props.href}
      role="menuitem"
      onClick={props.onClick}
      class="flex px-4 py-3 gap-x-4 motion-safe:transition-colors hover:bg-black hover:bg-opacity-20"
    >
      <Icon src={props.icon} alt="" class="w-6 h-6 invert opacity-60" />
      {props.children}
    </ButtonOrAnchor>
  );
}
