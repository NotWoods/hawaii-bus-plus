import { Admin, GoTrue } from '@hawaii-bus-plus/gotrue';
import { NetlifyIdentityContext } from '../types.js';
import { getAdmin } from './admin.js';

let cache: { auth: GoTrue; admin: Admin } | undefined;
let url: string | undefined;

export function getAuth(
  identity: NetlifyIdentityContext = { url: '', token: '' },
) {
  if (identity.url !== url || !cache) {
    url = identity.url;
    const auth = new GoTrue({ APIUrl: identity.url });
    const admin = getAdmin(auth, identity);
    cache = { auth, admin };
  }
  return cache;
}
