import { ComponentChildren, h } from 'preact';
import { ButtonOrAnchor } from '../../../page/buttons/ButtonOrAnchor';

interface Props {
  href?: string;
  children: ComponentChildren;
}

export function SettingsItem(props: Props) {
  return (
    <ButtonOrAnchor class="border-b-1" href={props.href}>
      {props.children}
    </ButtonOrAnchor>
  );
}
