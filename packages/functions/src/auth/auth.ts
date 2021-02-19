import GoTrue, { User } from 'gotrue-js';
import { URLSearchParams } from 'url';
import { NetlifyContext, NetlifyEvent, NetlifyResponse } from '../../types';

function jsonResponse(statusCode: number, body: unknown): NetlifyResponse {
  return {
    statusCode,
    body: JSON.stringify(body),
    headers: {
      'Content-Type': 'application/json',
    },
  };
}

class RequiredError extends Error {}

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
      // Login existing user
      case 'login': {
        user = await auth.login(
          formData.req('email'),
          formData.req('password')
        );
        break;
      }
      case 'recover': {
        user = await auth.recover(formData.req('token'));
        break;
      }
      case 'requestPasswordRecovery': {
        await auth.requestPasswordRecovery(formData.req('email'));
        return jsonResponse(200, {
          type: 'recoveryEmailSent',
        });
      }
      // Sign up new user
      case 'signup': {
        await auth.signup(formData.req('email'), formData.req('password'), {
          name: formData.get('name'),
        });
        break;
      }
      // Change email address associated with user
      case 'changeEmail':
        return jsonResponse(501, {
          error: 'Not Implemented',
        });
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
}
