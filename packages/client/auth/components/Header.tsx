import { h } from 'preact';
import { useEffect } from 'preact/hooks';
import { Title } from '../../all-pages/Title';
import { FormType } from './Form';
import { MouseEventHandler } from './link';

interface Props {
  type?: FormType;
  onLinkClick?: MouseEventHandler;
}

function headerContent(type: FormType | undefined) {
  switch (type) {
    case 'login':
      return {
        name: 'Login',
        title: 'Welcome back!',
        subtitle: {
          prefix: 'Not registered? ',
          href: 'https://eepurl.com/hqxfyb',
          content: 'Sign up for early access.',
        },
      };
    case 'acceptInvite':
    case 'signup':
      return {
        name: 'Register',
        title: 'Create your account',
        subtitle: {
          prefix: 'Already signed up? ',
          href: '/auth/login',
          content: 'Login to your account.',
        },
      };
    case 'requestPasswordRecovery':
    case 'recover':
      return {
        name: 'Reset your password',
        title: 'Reset your password',
      };
    case undefined:
      return {
        title: '404 Page not found',
        subtitle: {
          href: '/auth/login',
          content: 'Login to your account.',
        },
      };
  }
}

export function Header({ type, onLinkClick }: Props) {
  const { name, title, subtitle } = headerContent(type);

  useEffect(() => {
    const suffix = 'Hawaii Bus Plus';
    document.title = name ? `${name} - ${suffix}` : suffix;
  }, [name]);

  return (
    <header class="text-center">
      <Title class="justify-center" />
      <h2 class="mt-6 text-4xl font-display font-medium text-gray-100">
        {title}
      </h2>
      {subtitle ? (
        <p class="mt-2 text-sm text-gray-200">
          {subtitle.prefix}
          <a
            href={subtitle.href}
            class="font-medium text-gray-100 hover:underline"
            onClick={subtitle.href.startsWith('http') ? undefined : onLinkClick}
          >
            {subtitle.content}
          </a>
        </p>
      ) : null}
    </header>
  );
}
