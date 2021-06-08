import { h } from 'preact';
import { useEffect, useState } from 'preact/hooks';
import { Logo } from '../../all-pages/components/Logo';

function checkLoggedIn() {
  return fetch('https://app.hawaiibusplus.com/.netlify/functions/userdata', {
    credentials: 'include',
  }).then(
    (res) => res.ok,
    () => false,
  );
}

export function dynamicLoginButton() {
  return checkLoggedIn().then((loggedIn) => {
    if (loggedIn) {
      const hide: HTMLElement = document.querySelector('#login')!;
      hide.hidden = true;

      const button: HTMLAnchorElement = document.querySelector('#openApp')!;
      button.href = '/';
      button.textContent = 'Open app';
    }
  });
}

export function PageHeader() {
  const [loggedIn, setLoggedIn] = useState(false);
  useEffect(() => {
    // eslint-disable-next-line @typescript-eslint/no-floating-promises
    checkLoggedIn().then(setLoggedIn);
  }, []);

  return (
    <header class="flex pt-6 max-w-5xl items-center mx-auto">
      <a href="https://hawaiibusplus.com" class="mr-auto">
        <Logo />
      </a>
      <a
        id="login"
        class="shadow motion-safe:transition-colors text-white border bg-black bg-opacity-0 hover:bg-opacity-20 px-4 py-2"
        href="/auth/login"
        hidden={loggedIn}
      >
        Login
      </a>
      <a
        id="openApp"
        class="shadow motion-safe:transition-colors text-black bg-white hover:bg-gray-200 px-4 py-2 ml-2"
        href={loggedIn ? '/' : '/auth/register'}
      >
        {loggedIn ? 'Open app' : 'Create account'}
      </a>
    </header>
  );
}
