import { UserData } from '@hawaii-bus-plus/gotrue';

const paidRoles = new Set(['plus', 'trial']);

export function hasPaidAccess(user: UserData) {
  const metadata = user.app_metadata;
  const roles = [user.role].concat(metadata.roles ?? []);
  return roles.some((role) => paidRoles.has(role));
}
