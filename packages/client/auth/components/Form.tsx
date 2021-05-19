import { h } from 'preact';
import { Input } from './Input';
import { MouseEventHandler } from './link';
import { SubmitButton } from './SubmitButton';

export type FormType =
  | 'acceptInvite'
  | 'login'
  | 'recover'
  | 'requestPasswordRecovery'
  | 'signup';

export interface FormProps {
  type: FormType;
  token?: string;
  existingEmail?: string;
  redirectTo?: string;
  onLinkClick?: MouseEventHandler;
}

const nameTypes: ReadonlySet<FormType> = new Set(['acceptInvite', 'signup']);
const readonlyEmailTypes: ReadonlySet<FormType> = new Set([
  'acceptInvite',
  'recover',
]);
const passwordTypes: ReadonlySet<FormType> = new Set([
  'acceptInvite',
  'login',
  'recover',
  'signup',
]);
/*const thirdPartyTypes: ReadonlySet<FormType> = new Set([
  'acceptInvite',
  'login',
  'signup',
]);*/

export function Form({
  type,
  existingEmail,
  redirectTo = '',
  token = '',
  onLinkClick,
}: FormProps) {
  const readonlyEmail = readonlyEmailTypes.has(type);
  let email: string | undefined;
  if (readonlyEmail) {
    email = existingEmail ?? '<hidden>';
  } else if (type === 'signup') {
    email = existingEmail;
  }

  return (
    <form
      class="mt-8 px-12 py-8 space-y-6 bg-gray-50 text-black"
      action="/.netlify/functions/auth"
      method="POST"
    >
      {nameTypes.has(type) ? (
        <Input id="name" name="name" type="text" autocomplete="full-name">
          Name
        </Input>
      ) : undefined}
      <Input
        id="email-address"
        name="email"
        type="email"
        key={readonlyEmail ? 'readonly' : 'edit'}
        autocomplete={readonlyEmail ? 'off' : 'email'}
        readonly={readonlyEmail}
        value={email}
      >
        Email address
      </Input>
      {passwordTypes.has(type) ? (
        <Input
          id="password"
          name="password"
          type="password"
          autocomplete={
            type === 'recover' ? 'new-password' : 'current-password'
          }
        >
          Password
          {type === 'login' ? (
            <a
              href="/auth/forgot"
              class="font-medium text-primary-500 hover:underline"
              onClick={onLinkClick}
            >
              Forgot your password?
            </a>
          ) : undefined}
        </Input>
      ) : undefined}

      <SubmitButton type={type} />

      <input type="hidden" name="type" required value={type} />
      <input type="hidden" name="redirect_to" value={redirectTo} />
      <input type="hidden" name="token" value={token} />
    </form>
  );
}
