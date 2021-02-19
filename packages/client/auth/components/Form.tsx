import { ComponentChildren, h } from 'preact';
import { Input } from './Input';

type FormType =
  | 'acceptInvite'
  | 'confirm'
  | 'login'
  | 'recover'
  | 'requestPasswordRecovery'
  | 'signup';

interface Props {
  type: FormType;
  token?: string;
  existingEmail?: string;
  newEmail?: string;
  redirectTo?: string;
  children?: ComponentChildren;
}

const readonlyEmailTypes: ReadonlySet<FormType> = new Set([
  'acceptInvite',
  'confirm',
  'recover',
]);
const passwordTypes: ReadonlySet<FormType> = new Set([
  'acceptInvite',
  'login',
  'recover',
  'signup',
]);

export function Form(props: Props) {
  const { type, existingEmail = '' } = props;
  return (
    <form
      class="mt-8 px-12 py-8 space-y-6 bg-gray-50 text-black"
      action="#"
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
        </Input>
      ) : null}

      {props.children}
    </form>
  );
}
