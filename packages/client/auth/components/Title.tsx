import { HeaderType } from './Header';

export function titleContent(type: HeaderType | undefined) {
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
