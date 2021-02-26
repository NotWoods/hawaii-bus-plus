import { useEffect } from 'preact/hooks';
import { HeaderType } from './Header';

interface Props {
  type?: HeaderType;
}

function titleContent(type: HeaderType | undefined) {
  switch (type) {
    case 'login':
      return 'Login';
    case 'acceptInvite':
    case 'signup':
      return 'Register';
    case 'requestPasswordRecovery':
    case 'recover':
      return 'Reset your password';
    case 'success':
    case 'sentConfirmation':
      return 'Success';
    case undefined:
      return '404';
  }
}

export function renderTitle(type: HeaderType | undefined) {
  const suffix = 'Hawaii Bus Plus';
  const title = titleContent(type);
  return title ? `${title} - ${suffix}` : suffix;
}

export function PageTitle(props: Props) {
  const { type } = props;
  const title = titleContent(type);

  useEffect(() => {
    document.title = title;
  }, [title]);

  return null;
}
