import GoTrue from 'gotrue-js';
import { NetlifyIdentityContext } from '../types';

let auth: GoTrue | undefined;
let url: string | undefined;

export function getAuth(identity: NetlifyIdentityContext) {
  if (identity.url !== url || !auth) {
    auth = new GoTrue({ APIUrl: identity.url });
    url = identity.url;
  }
  return auth;
}
