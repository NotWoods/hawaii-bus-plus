import { Buffer } from 'buffer';
import GoTrue from 'gotrue-js';
import fetch from 'node-fetch';
import { NetlifyIdentityContext } from '../types';

declare module globalThis {
  let fetch: typeof import('node-fetch').default;
  let window: {
    atob(base64: string): string;
  };
}

globalThis.fetch = fetch;
globalThis.window = {
  atob: (base64) => Buffer.from(base64, 'base64').toString('ascii'),
};

let auth: GoTrue | undefined;
let url: string | undefined;

export function getAuth(identity: NetlifyIdentityContext) {
  if (identity.url !== url || !auth) {
    auth = new GoTrue({ APIUrl: identity.url });
    url = identity.url;
  }
  return auth;
}
