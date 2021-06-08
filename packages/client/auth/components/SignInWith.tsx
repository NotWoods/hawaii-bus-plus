import { h, Fragment } from 'preact';

interface Props {
  apiUrl?: string;
  provider: 'Google';
  token?: string;
}

/**
 * Currently Netlify doesn't give any control over the callback URL on free plans,
 * forcing you to handle it at the root page with client-side code.
 */
export function SignInWithButton(props: Props) {
  const { provider, token, apiUrl = '/.netlify/identity' } = props;
  const params = new URLSearchParams();
  params.set('provider', provider.toLowerCase());
  if (token) {
    params.set('invite_token', token);
  }

  return (
    <a
      href={`${apiUrl}/authorize?${params.toString()}`}
      class="flex justify-center motion-safe:transition-colors w-full py-2 px-4 border border-current hover:bg-red hover:bg-opacity-20 font-medium focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-cyan"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        aria-label="Google"
        role="img"
        viewBox="0 0 512 512"
        width="24"
        height="24"
        class="w-6 h-6 mr-1"
      >
        <path
          fill="#4285f4"
          d="M386 400c45-42 65-112 53-179H260v74h102c-4 24-18 44-38 57z"
        />
        <path
          fill="#34a853"
          d="M90 341a192 192 0 0 0 296 59l-62-48c-53 35-141 22-171-60z"
        />
        <path
          fill="#fbbc02"
          d="M153 292c-8-25-8-48 0-73l-63-49c-23 46-30 111 0 171z"
        />
        <path
          fill="#ea4335"
          d="M153 219c22-69 116-109 179-50l55-54c-78-75-230-72-297 55z"
        />
      </svg>
      Continue with {provider}
    </a>
  );
}

export function SignInWith(props: Omit<Props, 'provider'>) {
  return (
    <>
      <fieldset class="border-t text-center">
        <legend class="px-4">Or</legend>
      </fieldset>
      <div class="flex">
        <SignInWithButton {...props} provider="Google" />
      </div>
    </>
  );
}
