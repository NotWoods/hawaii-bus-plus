import GoTrue, { User } from 'gotrue-js';
import { NetlifyIdentityContext } from '../types';

// These properties exist but are private
declare module 'gotrue-js' {
  export default interface GoTrue {
    readonly api: unknown;
    readonly audience: string;
  }

  export interface User {
    _refreshToken(token: string): Promise<unknown>;
  }
}

/**
 * `User` designed to be converted into an admin
 * using the admin token given to Netlify Functions.
 */
class AdminUser extends User {
  private readonly adminToken: string;

  constructor(auth: GoTrue, identity: NetlifyIdentityContext) {
    super(auth.api, undefined, auth.audience);
    this.adminToken = identity.token;
  }

  jwt() {
    // Return the admin token here so that it gets used in requests.
    return Promise.resolve(this.adminToken);
  }

  /**
   * Override so we don't need to fake a token response,
   * the 2nd parameter of the super constructor.
   */
  _processTokenResponse() {
    // Override so we don't need to fake a token response,
    // the 2nd parameter of the super constructor.
  }
}

export function getAdmin(
  auth: GoTrue,
  identity: NetlifyIdentityContext
): User['admin'] {
  return new AdminUser(auth, identity).admin;
}
