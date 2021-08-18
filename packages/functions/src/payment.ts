import { TextHTTPError } from '@hawaii-bus-plus/gotrue';
import { createHandler } from '../shared';
import { getReferrer } from '../shared/cookie/referrer';
import { database, stripe } from '../shared/stripe';

/**
 * Retrieve the payment info for a user.
 */
export const handler = createHandler('GET', async (event, context) => {
  const referrer = getReferrer(event);
  if (!referrer || !referrer.host.endsWith('hawaiibusplus.com')) {
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

  const stripeId = await database.getUserByNetlifyId(userDetails.id);
  if (!stripeId) {
    throw new TextHTTPError(
      { status: 500, statusText: 'Internal Server Error' },
      `Can't find payment info. Please contact support.`,
    );
  }

  const customer = await stripe.customers.retrieve(stripeId, {
    expand: ['subscriptions'],
  });
  if (customer.deleted) {
    throw new TextHTTPError(
      { status: 400, statusText: 'Bad Request' },
      `User is deleted on Stripe`,
    );
  }

  const [subscription] = customer.subscriptions!.data;
  const payment_method =
    subscription.default_payment_method ??
    customer.invoice_settings.default_payment_method;
  const source = subscription.default_source ?? customer.default_source;
  const end_at = subscription.trial_end ?? subscription.cancel_at;

  return {
    statusCode: 200,
    body: JSON.stringify({
      payment_method,
      source,
      can_pay: Boolean(payment_method ?? source),
      status: subscription.status,
      end: end_at != undefined ? end_at * 1000 : undefined,
    }),
  };
});
