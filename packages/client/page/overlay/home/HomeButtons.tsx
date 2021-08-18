import { ComponentChildren, h } from 'preact';
import { Icon } from '../../../assets/icons/Icon';
import { error, login, payments } from '../../../assets/icons/paths';
import { OutlinedButton } from '../../../components/Button/OutlinedButton';
import { HomeButtonsError } from './hooks';

function HomeButtons(props: {
  children?: ComponentChildren;
  icon: string;
  about: ComponentChildren;
}) {
  return (
    <div class="mx-4 mt-8">
      <p class="flex mb-4">
        <Icon
          src={props.icon}
          alt=""
          class="w-6 h-6 mt-1 mr-2 invert opacity-60"
        />
        {props.about}
      </p>
      {props.children}
    </div>
  );
}

export function LoginButtons() {
  return (
    <HomeButtons
      icon={login}
      about="You need to have an account to use Hawaii Bus Plus."
    >
      <OutlinedButton href="/auth/login" class="mb-1">
        Login
      </OutlinedButton>
      <OutlinedButton href="/auth/register">Sign up</OutlinedButton>
    </HomeButtons>
  );
}

export function BillingButtons() {
  return (
    <HomeButtons
      icon={payments}
      about="Your account has expired. Sign up for a new plan to use Hawaii Bus Plus."
    >
      <OutlinedButton href="/.netlify/functions/billing" class="mb-1">
        Billing
      </OutlinedButton>
    </HomeButtons>
  );
}

export function BrowserUnsupported() {
  return (
    <HomeButtons
      icon={error}
      about="Bus data failed to load, try refreshing or clearing your browser cache."
    />
  );
}

export function HomeErrorButtons(props: { error: HomeButtonsError }) {
  switch (props.error.code) {
    case 401:
      return <LoginButtons />;
    case 402:
      return <BillingButtons />;
  }
}
