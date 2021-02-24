import { SignupResponse } from '@hawaii-bus-plus/gotrue';
import { database, stripe } from '../../shared/stripe';

export async function createUserInDb(user: SignupResponse) {
  const metadata = user.user_metadata as { full_name?: string };

  // create a new customer in Stripe
  const customer = await stripe.customers.create({
    email: user.email,
    name: metadata.full_name,
  });
  // subscribe the new customer to the plus plan
  const subscription = await stripe.subscriptions.create({
    customer: customer.id,
    items: [{ price: process.env.STRIPE_PLUS_PRICE_PLAN }],
    trial_period_days: 14,
  });

  await database.createUser(user.id, customer.id);
  console.log('New user', user.id, customer.id, subscription.id);

  return {
    app_metadata: {
      roles: ['trial'],
    },
    user_metadata: metadata,
  };
}
