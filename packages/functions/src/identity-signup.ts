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
  const metadata = user.user_metadata as { full_name?: string };
  console.log('hi user', user);

  // create a new customer in Stripe
  const customer = await stripe.customers.create({
    email: user.email,
    name: metadata.full_name,
  });
  console.log('hi customer', customer.id);
  // subscribe the new customer to the plus plan
  const subscription = await stripe.subscriptions.create({
    customer: customer.id,
    items: [{ price: process.env.STRIPE_PLUS_PRICE_PLAN }],
    trial_period_days: 14,
  });
  console.log('hi sub', subscription.id);

  await database.createUser(user.id, customer.id, subscription);
  console.log('hi db');

  return jsonResponse(200, {
    app_metadata: {
      roles: ['trial'],
    },
    user_metadata: {
      ...metadata,
    },
  });
}
