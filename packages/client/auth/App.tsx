import { h, Fragment } from 'preact';
import { useEffect, useState } from 'preact/hooks';
import { Form, FormType, FormProps } from './components/Form';
import { Header } from './components/Header';
import { MouseEventHandler } from './components/link';

interface Props extends Omit<FormProps, 'type'> {
  defaultType: FormType | undefined;
}

export function urlToType(url: URL): FormType | undefined {
  let path = url.pathname;
  if (!path.startsWith('/auth/')) {
    return undefined;
  }
  path = path.slice('/auth/'.length);
  if (path.endsWith('/')) {
    path = path.slice(0, -1);
  }

  switch (path) {
    case 'login':
      return 'login';
    case 'register':
      return 'signup';
    case 'forgot':
      return 'requestPasswordRecovery';
    case 'recover':
      return 'recover';
    case 'invite':
      return 'acceptInvite';
    default:
      return undefined;
  }
}

export function App(props: Props) {
  const [type, setType] = useState<FormType | undefined>(props.defaultType);

  const handleLink: MouseEventHandler = (evt) => {
    evt.preventDefault();
    const url = new URL(evt.currentTarget.href);
    setType(urlToType(url));

    history.pushState(undefined, '', url.pathname);
  };

  useEffect(() => {
    function listener() {
      setType(urlToType(new URL(window.location.href)));
    }

    window.addEventListener('popstate', listener);
    return () => window.removeEventListener('popstate', listener);
  }, []);

  return (
    <>
      <Header type={type} onLinkClick={handleLink} />
      {type ? (
        <Form {...props} type={type} onLinkClick={handleLink} />
      ) : undefined}
    </>
  );
}
