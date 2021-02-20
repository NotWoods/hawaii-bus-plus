import { recoverSession } from '../shared/cookie/parse';
import { removeCookie } from '../shared/cookie/serialize';
import { getAuth } from '../shared/identity/auth';
import { NetlifyContext, NetlifyEvent, NetlifyResponse } from '../shared/types';

/**
 * Logout user
 */
export async function handler(
  event: NetlifyEvent,
  context: NetlifyContext
): Promise<NetlifyResponse> {
  const { identity } = context.clientContext;
  const auth = getAuth(identity);

  const loggedInUser = recoverSession(auth, event.headers);
  if (loggedInUser) {
    await loggedInUser.logout();
  }

  return {
    statusCode: 302,
    body: '',
    headers: {
      Location: '/auth/login',
    },
    multiValueHeaders: {
      'Set-Cookie': removeCookie(),
    },
  };
}
