import { h } from 'preact';
import { MenuOption } from './MenuOption';
import paymentsIcon from '../../icons/payments.svg';
import logoutIcon from '../../icons/logout.svg';
import feedbackIcon from '../../icons/feedback.svg';
import { classNames } from '../../hooks/classnames';

interface Props {
  open?: boolean;
  labelledBy?: string;
}

function Divider() {
  return <hr class="my-1 border-gray-300" />;
}

export function Menu(props: Props) {
  if (!props.open) return null;

  return (
    <nav
      class="fixed origin-top-right left-0 top-12 m-2 w-56 shadow-lg bg-blue-600 text-white ring-1 ring-black ring-opacity-50 z-10"
      role="menu"
      aria-orientation="vertical"
      aria-labelledby={props.labelledBy}
    >
      <MenuOption href="/.netlify/functions/billing" icon={paymentsIcon}>
        Billing
      </MenuOption>
      <MenuOption href="mailto:feedback@hawaiibusplus.com" icon={feedbackIcon}>
        Feedback
      </MenuOption>
      <Divider />
      <MenuOption href="/.netlify/functions/logout" icon={logoutIcon}>
        Logout
      </MenuOption>
    </nav>
  );
}
