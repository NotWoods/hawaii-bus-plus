import { User } from 'gotrue-js';
import { URL, URLSearchParams } from 'url';
import { NetlifyContext, NetlifyEvent, NetlifyResponse } from '../../types';
import { setCookie } from '../edituser/cookie';
import { jsonResponse, RequiredError } from '../edituser/response';
import { getAuth } from '../userdata/getAuth';

function parseFormData(event: NetlifyEvent) {
  let formData: URLSearchParams;
  if (event.httpMethod === 'GET') {
    formData = new URLSearchParams(event.queryStringParameters ?? {});
  } else {
    const { body } = event;
    if (!body) {
      throw new RequiredError('No body passed in');
    }

    formData = new URLSearchParams(body);
  }
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

const baseURL = new URL('https://app.hawaiibusplus.com/');

export async function handler(
  event: NetlifyEvent,
  context: NetlifyContext
): Promise<NetlifyResponse> {
  const { identity } = context.clientContext;
  const auth = getAuth(identity);
  const formData = parseFormData(event);

  let redirectTo = new URL(formData.get('redirect_to') ?? '', baseURL);
  if (
    !redirectTo.host.endsWith('.hawaiibusplus.com') &&
    redirectTo.hostname !== 'localhost'
  ) {
    redirectTo = baseURL;
  }

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

  return {
    statusCode: 303,
    body: '',
    headers: {
      Location: redirectTo.href,
    },
    multiValueHeaders: {
      'Set-Cookie': await setCookie(user),
    },
  };
}
