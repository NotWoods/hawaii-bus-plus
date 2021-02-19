import GoTrue, { User } from 'gotrue-js';
import { URLSearchParams } from 'url';
import { NetlifyContext, NetlifyEvent, NetlifyResponse } from '../../types';
import { setCookie } from '../edituser/cookie';
import { jsonResponse, RequiredError } from '../edituser/response';

function parseFormData(body: string | null) {
  if (!body) {
    throw new RequiredError('No body passed in');
  }

  const formData = new URLSearchParams(body);
  return {
    get(key: string) {
      return formData.get(key);
    },
    req(key: string) {
      const value = formData.get(key);
      if (!value) {
        throw new RequiredError(`Missing required parameter: ${key}`);
      }
      return value;
    },
  };
}

export async function handler(
  event: NetlifyEvent,
  context: NetlifyContext
): Promise<NetlifyResponse> {
  const { identity } = context.clientContext;
  const auth = new GoTrue({ APIUrl: identity.url });
  const formData = parseFormData(event.body);

  let user: User;
  try {
    const type = formData.req('type');
    switch (type) {
      // Accept invite for new user
      case 'acceptInvite': {
        user = await auth.acceptInvite(
          formData.req('token'),
          formData.req('password')
        );
        break;
      }
      // Confirm email address
      case 'confirm': {
        user = await auth.confirm(formData.req('token'));
        break;
      }
      // Sign up new user
      case 'signup': {
        const body = await auth.signup(
          formData.req('email'),
          formData.req('password')
        );
        return jsonResponse(200, body);
      }
      // Login existing user
      case 'login': {
        user = await auth.login(
          formData.req('email'),
          formData.req('password')
        );
        break;
      }
      // Request a password recovery
      case 'requestPasswordRecovery': {
        const body = await auth.requestPasswordRecovery(formData.req('email'));
        return jsonResponse(200, body);
      }
      // Recover password
      case 'recover': {
        user = await auth.recover(formData.req('token'));
        user = await user.update({ password: formData.req('password') });
        break;
      }
      default:
        throw new Error(`Invalid type ${type} given`);
    }
  } catch (err: unknown) {
    if (err instanceof RequiredError) {
      return jsonResponse(400, {
        error: err.message,
      });
    } else if (err instanceof Error) {
      return jsonResponse(500, {
        error: err.message,
      });
    } else {
      return jsonResponse(500, {
        error: 'Unknown server error',
      });
    }
  }

  const [userData, cookies] = await Promise.all([
    user.getUserData(),
    setCookie(user),
  ]);
  return {
    statusCode: 201,
    body: JSON.stringify({
      confirmed_at: userData.confirmed_at,
      created_at: userData.created_at,
      email: userData.email,
      role: userData.role,
      updated_at: userData.updated_at,
      user_metadata: userData.user_metadata,
    }),
    headers: {
      'Content-Type': 'application/json',
    },
    multiValueHeaders: {
      'Set-Cookie': cookies,
    },
  };
}
