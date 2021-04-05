import { TextHTTPError } from '@hawaii-bus-plus/gotrue';
import { createHandler } from '../shared';
import { refreshedOrNull } from '../shared/cookie/parse';
import { setCookie } from '../shared/cookie/serialize';
import { RequiredError } from '../shared/response';
import { formatUser } from '../shared/response/user';
import { NetlifyEvent } from '../shared/types';

function parseJson(event: NetlifyEvent) {
  if (event.httpMethod === 'GET') {
    return event.queryStringParameters;
  } else {
    const { body } = event;
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
}

/**
 * Update properties on the user.
 */
export const handler = createHandler(
  ['GET', 'POST'],
  async (event, context) => {
    const loggedInUser = await refreshedOrNull(context.authContext.currentUser);
    if (!loggedInUser) {
      throw new TextHTTPError(
        { status: 401, statusText: 'Unauthorized' },
        'Not logged in',
      );
    }

    const body = parseJson(event)!;
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
  },
);
