import { TextHTTPError } from '@hawaii-bus-plus/gotrue';
import { createHandler } from '../shared';
import { refreshedOrNull } from '../shared/cookie/parse';
import { removeCookie } from '../shared/cookie/serialize';
import { database, stripe } from '../shared/stripe';

/**
 * Delete the user from the database entirely.
 */
export const handler = createHandler('POST', async (_event, context) => {
  const { admin, currentUser } = context.authContext;

  const loggedInUser = await refreshedOrNull(currentUser);
  if (!loggedInUser) {
    throw new TextHTTPError(
      { status: 401, statusText: 'Unauthorized' },
      'Not logged in'
    );
  }

  const stripeId = await database.getUserByNetlifyId(loggedInUser.id);

  await Promise.all([
    admin.deleteUser(loggedInUser),
    database.deleteUser(loggedInUser.id),
    stripeId ? stripe.customers.del(stripeId) : undefined,
  ]);

  return {
    statusCode: 200,
    body: `Deleted user ${loggedInUser.email}`,
    headers: {
      'Content-Type': 'application/json',
    },
    multiValueHeaders: {
      'Set-Cookie': removeCookie(),
    },
  };
});
