import { feedback, logout, payments } from '../../../../assets/icons/paths';
import { FEATURE_BILLING } from '../../../../services/env';
import { MenuOption } from './MenuOption';

interface Props {
  labelledBy?: string;
  onDismiss: () => void;
}

function Divider() {
  return <hr class="my-1 border-gray-300" />;
}

export function Menu(props: Props) {
  return (
    <nav
      class="fixed origin-top-right left-0 top-12 m-2 w-56 shadow-lg bg-primary-600 text-white ring-1 ring-black ring-opacity-50 z-10"
      role="menu"
      aria-orientation="vertical"
      aria-labelledby={props.labelledBy}
      onKeyDown={function trapFocus(event) {
        if (event.key === 'Tab') {
          const focusableElements =
            event.currentTarget.querySelectorAll<HTMLElement>('button, a');
          const firstFocusableElement = focusableElements[0];
          const lastFocusableElement =
            focusableElements[focusableElements.length - 1];

          if (event.shiftKey) {
            // When pressing shift + tab on the first option, go to the last option
            if (document.activeElement === firstFocusableElement) {
              lastFocusableElement.focus();
              event.preventDefault();
            }
          } else {
            // When pressing tab on the last option, go to the first option
            if (document.activeElement === lastFocusableElement) {
              firstFocusableElement.focus();
              event.preventDefault();
            }
          }
        } else if (event.key === 'Escape') {
          props.onDismiss();
        }
      }}
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
