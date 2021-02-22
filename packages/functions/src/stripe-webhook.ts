import Stripe from 'stripe';
import { getAuth } from '../shared/identity/auth';
import { database, stripe } from '../shared/stripe';
import { getAdmin } from '../shared/identity/admin';
import { NetlifyContext, NetlifyEvent, NetlifyResponse } from '../shared/types';
import { UserData } from 'gotrue-js';

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
export async function handler(
  event: NetlifyEvent,
  context: NetlifyContext
): Promise<NetlifyResponse> {
  const { identity } = context.clientContext;
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
        return {
          statusCode: 500,
          body: 'Server Error: No user found that matches customer ID',
        };
      }

      const auth = getAuth(identity);
      const admin = getAdmin(auth, identity);

      await admin.updateUser({ id: netlifyId } as UserData, {
        app_metadata: {
          roles: [statusToRole(subscription.status)],
        },
      });

      return {
        statusCode: 200,
        body: '',
      };
    }
    default:
      return {
        statusCode: 404,
        body: 'Not Found: invalid event type',
      };
  }
}
