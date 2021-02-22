import { UserData } from 'gotrue-js';
import { jsonResponse } from '../shared/response';
import { database, stripe } from '../shared/stripe';
import { NetlifyContext, NetlifyEvent, NetlifyResponse } from '../shared/types';

interface IdentityEvent {
  event: 'login' | 'signup' | 'validate';
  user: UserData;
}

export async function handler(
  event: NetlifyEvent,
  _context: NetlifyContext
): Promise<NetlifyResponse> {
  const { user } = JSON.parse(event.body!) as IdentityEvent;

  // create a new customer in Stripe
  const customer = await stripe.customers.create({ email: user.email });
  // subscribe the new customer to the plus plan
  const subscription = await stripe.subscriptions.create({
    customer: customer.id,
    items: [{ price: process.env.STRIPE_PLUS_PRICE_PLAN }],
    trial_period_days: 14,
  });

  await database.createUser(user.id, customer.id, subscription);

  return jsonResponse(200, {
    app_metadata: {
      roles: ['trial'],
    },
    user_metadata: {
      ...user.user_metadata,
    },
  });
}
