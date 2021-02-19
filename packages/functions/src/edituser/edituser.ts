import GoTrue, { User } from 'gotrue-js';
import { NetlifyContext, NetlifyEvent, NetlifyResponse } from '../../types';
import { jsonResponse, RequiredError } from './response';
import { recoverSession, refreshedOrNull } from './cookie';

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
  const auth = new GoTrue({ APIUrl: identity.url });

  const loggedInUser = await refreshedOrNull(
    recoverSession(auth, event.headers)
  );
  if (!loggedInUser) {
    return jsonResponse(401, {
      error: 'Unauthorized: Not logged in',
    });
  }

  let user: User;
  try {
    const body = parseJson(event.body);
    user = await loggedInUser.update(body);
    return jsonResponse(200, {
      message: 'Updated user',
    });
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
