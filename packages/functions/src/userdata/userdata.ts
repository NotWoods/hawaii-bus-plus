import { NetlifyContext, NetlifyEvent, NetlifyResponse } from '../../types';
import { recoverSession, refreshedOrNull, setCookie } from '../edituser/cookie';
import { jsonResponse } from '../edituser/response';
import { formatUser } from '../userdata/formatUser';
import { getAuth } from './getAuth';

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
