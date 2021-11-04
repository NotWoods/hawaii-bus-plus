import { h, Fragment } from 'preact';
import { useCallback, useEffect, useState } from 'preact/hooks';
import { Form, FormType, FormProps } from './components/Form';
import { Header, HeaderType } from './components/Header';
import { MouseEventHandler } from './components/link';

interface Props extends Omit<FormProps, 'type'> {
  defaultType: HeaderType;
}

export function urlToType(url: URL): HeaderType | undefined {
  let path = url.pathname;
  if (path === '.netlify/functions/auth') {
    return 'success';
  } else if (!path.startsWith('/auth/')) {
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
    case 'done':
      return 'success';
    case 'registered':
      return 'sentConfirmation';
    case 'index.html':
      return (url.searchParams.get('type') as HeaderType) ?? undefined;
    default:
      return undefined;
  }
}

const headerTypes = new Set<HeaderType>([
  'success',
  'sentConfirmation',
  undefined,
]);

function useRouteType(
  defaultType?: HeaderType,
): [HeaderType, (url: URL) => HeaderType] {
  const [type, setType] = useState<HeaderType>(defaultType);

  const setFromUrl = useCallback((url: URL) => {
    const type = urlToType(url);
    setType(type);
    return type;
  }, []);

  return [type, setFromUrl];
}

export function App(props: Props) {
  const [type, setType] = useRouteType(props.defaultType);

  const handleLink: MouseEventHandler = (evt) => {
    evt.preventDefault();
    const url = new URL(evt.currentTarget.href);
    const type = setType(url);

    history.pushState(type, '', url.pathname);
  };

  useEffect(() => {
    function listener() {
      setType(new URL(window.location.href));
    }

    window.addEventListener('popstate', listener);
    return () => window.removeEventListener('popstate', listener);
  }, [setType]);

  return (
    <>
      <Header type={type} onLinkClick={handleLink} />
      {headerTypes.has(type) ? undefined : (
        <Form {...props} type={type as FormType} onLinkClick={handleLink} />
      )}
    </>
  );
}
