import { h } from 'preact';
import { FormType } from './Form';

interface Props {
  type: FormType;
}

function buttonText(type: FormType): string {
  switch (type) {
    case 'login':
      return 'Login';
    case 'acceptInvite':
    case 'signup':
      return 'Register';
    case 'requestPasswordRecovery':
      return 'Send password reset email';
    case 'recover':
      return 'Reset your password';
  }
}

export function SubmitButton(props: Props) {
  return (
    <button
      id="submit"
      type="submit"
      class="transition-colors w-full py-2 px-4 bg-blue-500 hover:bg-blue-600 font-medium text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-cyan"
    >
      {buttonText(props.type)}
    </button>
  );
}
