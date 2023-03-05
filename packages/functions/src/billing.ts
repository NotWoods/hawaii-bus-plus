import { TextHTTPError } from '@hawaii-bus-plus/gotrue';
import { URL } from 'url';
import { createHandler } from '../shared';
import { FEATURE_BILLING } from '../shared/env';
import { database, stripe } from '../shared/stripe';
import { NetlifyEvent } from '../shared/types';

function getReferrer(event: NetlifyEvent) {
  return event.headers['referer']
    ? new URL(event.headers['referer'])
    : undefined;
}

/**
 * Redirects to Stripe Billing page for the logged in user.
 */
export const handler = createHandler('GET', async (event, context) => {
  const referrer = getReferrer(event);
  if (!referrer?.host.endsWith('hawaiibusplus.com')) {
    throw new TextHTTPError(
      { status: 403, statusText: 'Forbidden' },
      'Must log in on https://hawaiibusplus.com',
    );
  }

  const loggedInUser = await context.authContext.user();
  const userDetails = await loggedInUser?.getUserData();
  if (!userDetails) {
    throw new TextHTTPError(
      { status: 401, statusText: 'Unauthorized' },
      'Not logged in',
    );
  }

  if (FEATURE_BILLING) {
    throw new TextHTTPError(
      { status: 500, statusText: 'Internal Server Error' },
      `Billing disabled. Please contact support.`,
    );
  }

  const stripeId = await database.getUserByNetlifyId(userDetails.id);
  if (!stripeId) {
    throw new TextHTTPError(
      { status: 500, statusText: 'Internal Server Error' },
      `Can't find payment info. Please contact support.`,
    );
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
});
