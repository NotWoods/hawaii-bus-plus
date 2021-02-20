import GoTrue from 'gotrue-js';
import fetch from 'node-fetch';
import { NetlifyIdentityContext } from '../types';

declare module globalThis {
  let fetch: typeof import('node-fetch').default;
}

// https://app.hawaiibusplus.com/auth/invite?token=_xARxWvKnP4KRmr71oUVWA&email=contact@tigeroakes.com

globalThis.fetch = fetch;

let auth: GoTrue | undefined;
let url: string | undefined;

export function getAuth(identity: NetlifyIdentityContext) {
  if (identity.url !== url || !auth) {
    auth = new GoTrue({ APIUrl: identity.url });
    url = identity.url;
  }
  return auth;
}
