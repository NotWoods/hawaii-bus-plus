import { UserData } from 'gotrue-js';

const paidRoles = new Set(['plus', 'trial']);

export function hasPaidAccess(user: UserData) {
  const metadata = user.app_metadata as { roles?: readonly string[] };
  const roles = [user.role].concat(metadata.roles ?? []);
  return roles.some((role) => paidRoles.has(role));
}
