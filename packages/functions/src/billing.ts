import { URL } from 'url';
import { recoverSession, refreshedOrNull } from '../shared/cookie/parse';
import { getAuth } from '../shared/identity/auth';
import { database, stripe } from '../shared/stripe';
import { NetlifyContext, NetlifyEvent, NetlifyResponse } from '../shared/types';

/**
 * Redirects to Stripe Billing page for the logged in user.
 */
export async function handler(
  event: NetlifyEvent,
  context: NetlifyContext
): Promise<NetlifyResponse> {
  const referrer = event.headers['referer']
    ? new URL(event.headers['referer'])
    : undefined;
  if (referrer && !referrer.host.endsWith('hawaiibusplus.com')) {
    return {
      statusCode: 403,
      body: 'Forbidden: Must log in on https://hawaiibusplus.com',
    };
  }

  const { identity } = context.clientContext;
  const { auth } = getAuth(identity);

  const loggedInUser = await refreshedOrNull(
    recoverSession(auth, event.headers)
  );
  const userDetails = await loggedInUser?.getUserData();
  if (!userDetails) {
    return {
      statusCode: 401,
      body: 'Unauthorized: Not logged in',
    };
  }

  const stripeId = await database.getUserByNetlifyId(userDetails.id);
  if (!stripeId) {
    return {
      statusCode: 500,
      body: `Internal Server Error: Can't find payment info. Please contact support.`,
    };
  }

  const link = await stripe.billingPortal.sessions.create({
    customer: stripeId,
    return_url: referrer?.href,
  });

  return {
    statusCode: 302,
    body: '',
    headers: {
      Location: link.url,
    },
  };
}
