import { recoverSession, refreshedOrNull } from '../shared/cookie/parse';
import { setCookie } from '../shared/cookie/serialize';
import { getAuth } from '../shared/identity/auth';
import { formatUser, jsonResponse } from '../shared/response';
import { NetlifyContext, NetlifyEvent, NetlifyResponse } from '../shared/types';

/**
 * Retrieve user data
 */
export async function handler(
  event: NetlifyEvent,
  context: NetlifyContext
): Promise<NetlifyResponse> {
  const { identity } = context.clientContext;
  const auth = getAuth(identity);

  const loggedInUser = await refreshedOrNull(
    recoverSession(auth, event.headers)
  );
  if (!loggedInUser) {
    return jsonResponse(401, {
      error: 'Unauthorized: Not logged in',
    });
  }

  const [userData, cookies] = await Promise.all([
    formatUser(loggedInUser),
    setCookie(loggedInUser),
  ]);

  return {
    statusCode: 200,
    body: JSON.stringify(userData),
    headers: {
      'Content-Type': 'application/json',
    },
    multiValueHeaders: {
      'Set-Cookie': cookies,
    },
  };
}
