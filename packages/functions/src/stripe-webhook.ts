import { TextHTTPError } from '@hawaii-bus-plus/gotrue';
import Stripe from 'stripe';
import { createHandler } from '../shared';
import { database, stripe } from '../shared/stripe';

function customerId({ customer }: Stripe.Subscription) {
  if (typeof customer === 'string') {
    return customer;
  } else {
    return customer.id;
  }
}

function statusToRole(status: Stripe.Subscription.Status) {
  switch (status) {
    case 'active':
    case 'incomplete':
      return 'plus';
    case 'trialing':
      return 'trial';
    default:
      return 'canceled';
  }
}

/**
 * Handle Stripe webhook events
 */
export const handler = createHandler('POST', async (event, context) => {
  const stripeEvent = stripe.webhooks.constructEvent(
    event.body!,
    event.headers['stripe-signature']!,
    process.env.STRIPE_WEBHOOK_SECRET!
  );

  switch (stripeEvent.type) {
    case 'customer.subscription.updated': {
      // Update user role based on subscription status
      const subscription = stripeEvent.data.object as Stripe.Subscription;
      const netlifyId = await database.getUserByStripeId(
        customerId(subscription)
      );
      if (!netlifyId) {
        throw new TextHTTPError(
          { status: 500, statusText: 'Internal Server Error' },
          'No user found that matches customer ID'
        );
      }

      await context.authContext.admin.updateUser(
        { id: netlifyId },
        {
          app_metadata: {
            roles: [statusToRole(subscription.status)],
          },
        }
      );

      return {
        statusCode: 200,
        body: '',
      };
    }
    default:
      throw new TextHTTPError(
        { status: 404, statusText: 'Not Found' },
        `Invalid event type ${stripeEvent.type}`
      );
  }
});
