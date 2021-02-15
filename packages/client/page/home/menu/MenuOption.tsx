import { ComponentChildren, h } from 'preact';
import { ButtonOrAnchor } from '../../buttons/ButtonOrAnchor';
import { Icon } from '../../icons/Icon';

interface Props {
  children: ComponentChildren;
  icon: string;
  href?: string;
  onClick?(evt: MouseEvent): void;
}

export function MenuOption(props: Props) {
  return (
    <li>
      <ButtonOrAnchor>
        <Icon src={props.icon} alt="" />
        {props.children}
      </ButtonOrAnchor>
    </li>
  );
}
