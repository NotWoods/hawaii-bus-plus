import { h } from 'preact';
import { Title } from '../../all-pages/Title';
import { FormType } from './Form';

interface Props {
  type?: FormType;
}

function headerContent(type: FormType | undefined) {
  switch (type) {
    case 'login':
      return {
        title: 'Welcome back!',
        subtitle: {
          prefix: 'Not registered?',
          href: '/auth/register',
          content: 'Start your 14-day free trial.',
        },
      };
    case 'acceptInvite':
    case 'signup':
      return {
        title: 'Create your account',
        subtitle: {
          prefix: 'Already signed up?',
          href: '/auth/login',
          content: 'Login to your account.',
        },
      };
    case 'requestPasswordRecovery':
    case 'recover':
      return { title: 'Reset your password' };
    case undefined:
      return { title: 'Redirecting...' };
  }
}

export function Header({ type }: Props) {
  const { title, subtitle } = headerContent(type);

  return (
    <header class="text-center">
      <Title />
      <h2 class="mt-6 text-4xl font-display font-medium text-gray-100">
        {title}
      </h2>
      {subtitle ? (
        <p class="mt-2 text-sm">
          <span class="text-gray-200">{subtitle.prefix}</span>
          <a
            href={subtitle.href}
            class="font-medium text-gray-100 hover:underline"
          >
            {subtitle.content}
          </a>
        </p>
      ) : null}
    </header>
  );
}
