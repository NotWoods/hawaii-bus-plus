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
        <MenuOption icon={settingsIcon}>Theme</MenuOption>
        <MenuOption href="mailto:tiger@hawaiibusplus.com" icon={settingsIcon}>
          Feedback
        </MenuOption>
        <MenuOption href="/menu/settings" icon={settingsIcon}>
          Settings
        </MenuOption>
        <MenuOption href="/menu/help" icon={settingsIcon}>
          Help
        </MenuOption>
        <MenuOption href="/menu/settings" icon={settingsIcon}>
          About us
        </MenuOption>
      </ul>
    </nav>
  );
}
