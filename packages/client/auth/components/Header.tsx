import { ComponentChildren, h } from 'preact';
import { useEffect } from 'preact/hooks';
import { Title } from '../../all-pages/Title';
import { FormType } from './Form';
import { MouseEventHandler } from './link';

export type HeaderType = FormType | 'success' | 'sentConfirmation' | undefined;

interface Props {
  type?: HeaderType;
  redirectTo?: string;
  onLinkClick?: MouseEventHandler;
}

interface SubtitleProps {
  subtitle?: {
    prefix?: ComponentChildren;
    href?: string;
    content?: ComponentChildren;
  };
  redirectTo?: string;
  onLinkClick?: MouseEventHandler;
}

function headerContent(type: HeaderType | undefined) {
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
    case 'success':
      return {
        name: 'Success',
        title: `You're all set!`,
        subtitle: {
          content: 'Redirecting you to the app now...',
        },
      };
    case 'sentConfirmation':
      return {
        name: 'Success',
        title: `You're all set!`,
        subtitle: {
          prefix: 'You can now ',
          href: '/auth/login',
          content: 'login to your new account.',
        },
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

function HeaderSubtitle(props: SubtitleProps) {
  const { subtitle } = props;
  if (!subtitle) return null;

  let clickHandler: MouseEventHandler | undefined;
  if (subtitle.href && !subtitle.href.startsWith('http')) {
    clickHandler = props.onLinkClick;
  }

  return (
    <p class="mt-2 text-sm text-gray-200">
      {subtitle.prefix}
      {subtitle.content ? (
        <a
          href={subtitle.href ?? props.redirectTo}
          class="font-medium text-gray-100 hover:underline"
          onClick={clickHandler}
        >
          {subtitle.content}
        </a>
      ) : undefined}
    </p>
  );
}

export function Header(props: Props) {
  const { type } = props;
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
      <HeaderSubtitle
        subtitle={subtitle}
        redirectTo={props.redirectTo}
        onLinkClick={props.onLinkClick}
      />
    </header>
  );
}
