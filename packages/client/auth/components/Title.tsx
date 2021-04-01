import { h } from 'preact';
import {
  PageTitle as TitleComponent,
  withAppName,
} from '../../all-pages/components/PageTitle';
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
  return withAppName(titleContent(type));
}

export function PageTitle(props: Props) {
  const { type } = props;

  return <TitleComponent>{titleContent(type)}</TitleComponent>;
}
