import { recoverSession, refreshedOrNull } from '../shared/cookie/parse';
import { setCookie } from '../shared/cookie/serialize';
import { getAuth } from '../shared/identity/auth';
import { formatUser, jsonResponse } from '../shared/response';
import { NetlifyContext, NetlifyEvent, NetlifyResponse } from '../shared/types';

const defaultOrigin = 'https://app.hawaiibusplus.com';
const allowedOrigins = new Set([defaultOrigin, 'https://hawaiibusplus.com']);

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

  const requestOrigin = event.headers['origin']!;
  console.log(requestOrigin);
  const [userData, cookies] = await Promise.all([
    formatUser(loggedInUser),
    setCookie(loggedInUser),
  ]);

  return {
    statusCode: 200,
    body: JSON.stringify(userData),
    headers: {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': allowedOrigins.has(requestOrigin)
        ? requestOrigin
        : defaultOrigin,
      'Access-Control-Allow-Methods': 'GET, OPTION',
      Vary: 'Origin',
    },
    multiValueHeaders: {
      'Set-Cookie': cookies,
    },
  };
}
