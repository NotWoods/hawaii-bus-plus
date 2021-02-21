import { UserData } from 'gotrue-js';

export function hasPaidAccess(user: UserData) {
  return user.role === 'plus' || user.role === 'trial';
}
