import { h } from 'preact';
import { feedback, logout, payments } from '../../../../assets/icons/paths';
import { FEATURE_BILLING } from '../../../../services/env';
import { MenuOption } from './MenuOption';

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
      class="fixed origin-top-right left-0 top-12 m-2 w-56 shadow-lg bg-primary-600 text-white ring-1 ring-black ring-opacity-50 z-10"
      role="menu"
      aria-orientation="vertical"
      aria-labelledby={props.labelledBy}
    >
      {FEATURE_BILLING && (
        <MenuOption href="/.netlify/functions/billing" icon={payments}>
          Billing
        </MenuOption>
      )}
      <MenuOption href="mailto:feedback@hawaiibusplus.com" icon={feedback}>
        Feedback
      </MenuOption>
      <Divider />
      <MenuOption href="/.netlify/functions/logout" icon={logout}>
        Logout
      </MenuOption>
    </nav>
  );
}
