import { Admin, GoTrue, Token, User } from '@hawaii-bus-plus/gotrue';
import { NetlifyIdentityContext } from '../types.js';

/**
 * `User` designed to be converted into an admin
 * using the admin token given to Netlify Functions.
 */
class AdminUser extends User {
  constructor(auth: GoTrue, identity: NetlifyIdentityContext) {
    super(auth.api, { access_token: identity.token } as Token, auth.audience);
  }

  _refreshToken() {
    // Override so we never refresh.
    return Promise.resolve(this.token.access_token);
  }
}

export function getAdmin(
  auth: GoTrue,
  identity: NetlifyIdentityContext,
): Admin {
  return new AdminUser(auth, identity).admin;
}
