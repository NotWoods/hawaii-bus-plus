import { h } from 'preact';

interface Props {
  type: 'Google';
}

export function SignInWithButton(props: Props) {
  return (
    <a
      href="#"
      class="flex justify-center transition-colors w-full py-2 px-4 border border-current hover:bg-red hover:bg-opacity-20 font-medium focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-cyan"
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
      Continue with {props.type}
    </a>
  );
}

export function SignInWith() {
  return (
    <div class="flex">
      <SignInWithButton type="Google" />
    </div>
  );
}
