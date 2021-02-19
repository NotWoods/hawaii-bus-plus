import { h } from 'preact';
import { Input } from './Input';
import { SignInWith } from './SignInWith';
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
  newEmail?: string;
  redirectTo?: string;
}

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

export function Form(props: FormProps) {
  const { type, existingEmail = '<hidden>' } = props;
  return (
    <form
      class="mt-8 px-12 py-8 space-y-6 bg-gray-50 text-black"
      action="/.netlify/functions/auth"
      method="POST"
    >
      <input type="hidden" name="type" required value={type} />
      <input type="hidden" name="redirect_to" value={props.redirectTo} />
      <input type="hidden" name="token" value={props.token} />
      <Input
        id="email-address"
        name="email"
        type="email"
        autocomplete={readonlyEmailTypes.has(type) ? 'off' : 'email'}
        readonly={readonlyEmailTypes.has(type)}
        value={readonlyEmailTypes.has(type) ? existingEmail : undefined}
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
          <a
            href="/auth/forgot"
            class="font-medium text-blue-500 hover:underline"
          >
            Forgot your password?
          </a>
        </Input>
      ) : null}

      <SubmitButton type={type} />

      <fieldset class="border-t text-center">
        <legend class="px-4">Or</legend>
      </fieldset>
      <SignInWith />
    </form>
  );
}
