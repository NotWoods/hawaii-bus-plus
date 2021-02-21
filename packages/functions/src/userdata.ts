import { recoverSession, refreshedOrNull } from '../shared/cookie/parse';
import { setCookie } from '../shared/cookie/serialize';
import { getAuth } from '../shared/identity/auth';
import { formatUser } from '../shared/response';
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

  const requestOrigin = event.headers['origin']!;
  const responseHeaders = {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': allowedOrigins.has(requestOrigin)
      ? requestOrigin
      : defaultOrigin,
    'Access-Control-Allow-Methods': 'GET, OPTION',
    'Access-Control-Allow-Credentials': 'true',
    Vary: 'Origin',
  };

  const loggedInUser = await refreshedOrNull(
    recoverSession(auth, event.headers)
  );
  if (!loggedInUser) {
    return {
      statusCode: 401,
      body: JSON.stringify({
        error: 'Unauthorized: Not logged in',
      }),
      headers: responseHeaders,
    };
  }

  const [userData, cookies] = await Promise.all([
    formatUser(loggedInUser),
    setCookie(loggedInUser),
  ]);

  return {
    statusCode: 200,
    body: JSON.stringify(userData),
    headers: responseHeaders,
    multiValueHeaders: {
      'Set-Cookie': cookies,
    },
  };
}
