import { h } from 'preact';
import { MenuOption } from './MenuOption';
import settingsIcon from '../../icons/settings.svg';

interface Props {
  open?: boolean;
}

export function Menu(props: Props) {
  return (
    <nav open={props.open}>
      <ul>
        <MenuOption href="/menu/account" icon={settingsIcon}>
          My account
        </MenuOption>
        <MenuOption
          href="mailto:feedback@hawaiibusplus.com"
          icon={settingsIcon}
        >
          Feedback
        </MenuOption>
      </ul>
    </nav>
  );
}
