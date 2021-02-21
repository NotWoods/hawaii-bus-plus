import { h, Fragment } from 'preact';
import { useEffect, useState } from 'preact/hooks';
import { Form, FormType, FormProps } from './components/Form';
import { Header, HeaderType } from './components/Header';
import { Alert } from './components/Alert';
import { MouseEventHandler } from './components/link';

interface Props extends Omit<FormProps, 'type'> {
  defaultType: HeaderType;
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
    case 'invited':
      return 'acceptInvite';
    default:
      return undefined;
  }
}

export function App(props: Props) {
  const [type, setType] = useState<HeaderType>(props.defaultType ?? 'success');

  const handleLink: MouseEventHandler = (evt) => {
    evt.preventDefault();
    const url = new URL(evt.currentTarget.href);
    const type = urlToType(url);
    setType(type);

    history.pushState(type, '', url.pathname);
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
      {type != undefined && type != 'success' ? (
        <Form {...props} type={type} onLinkClick={handleLink} />
      ) : undefined}
      <Alert />
    </>
  );
}
