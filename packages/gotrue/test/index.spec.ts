import test from 'ava';
import { JSONHTTPError } from '../src/index.js';
import { auth, instanceOf } from './helpers.js';

test.before('create user', async (t) => {
  try {
    const signUp = await auth.signup('test@example.com', 'newpass');

    t.is(typeof signUp.id, 'string');
    t.is(typeof signUp.confirmed_at, 'string');
    t.is(typeof signUp.created_at, 'string');
    t.is(typeof signUp.updated_at, 'string');

    t.is(signUp.email, 'test@example.com');
  } catch (err: unknown) {
    instanceOf(t, err, JSONHTTPError);
    t.like(err, {
      json: {
        code: 400,
        msg: 'A user with this email address has already been registered',
      },
      status: 400,
      message: 'A user with this email address has already been registered',
    });
  }
});

test('wrong password', async (t) => {
  try {
    await auth.login('test@example.com', 'wrongpassword');
  } catch (err: unknown) {
    instanceOf(t, err, JSONHTTPError);
    t.like(err, {
      json: {
        error: 'invalid_grant',
        error_description:
          'No user found with that email, or password invalid.',
      },
      status: 400,
      message:
        'invalid_grant: No user found with that email, or password invalid.',
    });
  }
});

test('refresh token', async (t) => {
  const user = await auth.login('test@example.com', 'newpass');
  t.is(typeof user.token.access_token, 'string');
  t.is(typeof user.token.refresh_token, 'string');
  t.is(user.email, 'test@example.com');

  const accessToken = await user.jwt(true);
  t.is(typeof accessToken, 'string');

  const token = user.tokenDetails();
  t.is(typeof token.access_token, 'string');
  t.is(typeof token.refresh_token, 'string');
  t.is(typeof token.expires_in, 'number');
  t.is(typeof token.expires_at, 'number');
  t.is(token.token_type, 'bearer');

  const result = await user.logout();
  t.is(result, undefined);
});

test('settings', async (t) => {
  const settings = await auth.settings();
  t.is(typeof settings.disable_signup, 'boolean');
  t.is(typeof settings.autoconfirm, 'boolean');
});
