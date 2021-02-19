import GoTrue from 'gotrue-js';

let auth: GoTrue | undefined;
let url: string | undefined;

export function getAuth(identity: { url: string }) {
  if (identity.url !== url || !auth) {
    auth = new GoTrue({ APIUrl: identity.url });
    url = identity.url;
  }
  return auth;
}
