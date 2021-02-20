import { NetlifyContext, NetlifyEvent, NetlifyResponse } from '../shared/types';
import { formatUser } from '../shared/response/user';
import { getAuth } from '../shared/identity/auth';
import { setCookie } from '../shared/cookie/serialize';
import { recoverSession, refreshedOrNull } from '../shared/cookie/parse';
import { jsonResponse, RequiredError } from '../shared/response';

function parseJson(body: string | null) {
  if (!body) {
    throw new RequiredError('No body passed in');
  }

  const data = JSON.parse(body) as unknown;
  if (typeof data === 'object' && data != null) {
    return data;
  } else {
    throw new Error(`Invalid body ${data as string}`);
  }
}

/**
 * Update properties on the user.
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

  try {
    const body = parseJson(event.body);
    const user = await loggedInUser.update(body);
    const [userData, cookies] = await Promise.all([
      formatUser(user),
      setCookie(user),
    ]);

    return {
      statusCode: 201,
      body: JSON.stringify(userData),
      headers: {
        'Content-Type': 'application/json',
      },
      multiValueHeaders: {
        'Set-Cookie': cookies,
      },
    };
  } catch (err: unknown) {
    if (err instanceof RequiredError) {
      return jsonResponse(400, {
        error: err.message,
      });
    } else if (err instanceof Error) {
      return jsonResponse(500, {
        error: err.message,
      });
    } else {
      return jsonResponse(500, {
        error: 'Unknown server error',
      });
    }
  }
}
