import GoTrue, { Token, User } from 'gotrue-js';
import fetch from 'node-fetch';
import { NetlifyIdentityContext } from '../types';
import { NodeUser } from './user';

declare module globalThis {
  let fetch: typeof import('node-fetch').default;
}

globalThis.fetch = fetch;

let auth: GoTrue | undefined;
let url: string | undefined;

class Auth extends GoTrue {
  createUser(tokenResponse: Token) {
    const user = new NodeUser(this.api, tokenResponse, this.audience);
    return user.getUserData() as Promise<User>;
  }
}

export function getAuth(identity: NetlifyIdentityContext) {
  if (identity.url !== url || !auth) {
    auth = new Auth({ APIUrl: identity.url });
    url = identity.url;
  }
  return auth;
}
