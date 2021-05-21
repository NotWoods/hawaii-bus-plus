import { ComponentChildren, h } from 'preact';
import { Button } from '../../buttons/Button';
import { Icon } from '../../icons/Icon';
import loginSvg from '../../icons/login.svg';
import paymentsSvg from '../../icons/payments.svg';
import errorSvg from '../../icons/error.svg';
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
          class="w-6 h-6 mt-1 mr-2 filter invert opacity-60"
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
      icon={loginSvg}
      about="You need to have an account to use Hawaii Bus Plus."
    >
      <Button href="/auth/login" class="mb-1">
        Login
      </Button>
      <Button href="/auth/register">Sign up</Button>
    </HomeButtons>
  );
}

export function BillingButtons() {
  return (
    <HomeButtons
      icon={paymentsSvg}
      about="Your account has expired. Sign up for a new plan to use Hawaii Bus Plus."
    >
      <Button href="/.netlify/functions/billing" class="mb-1">
        Billing
      </Button>
    </HomeButtons>
  );
}

export function BrowserUnsupported() {
  return (
    <HomeButtons
      icon={errorSvg}
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
