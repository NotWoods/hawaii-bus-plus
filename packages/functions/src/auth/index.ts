import { User } from '@hawaii-bus-plus/gotrue';
import { URL, URLSearchParams } from 'url';
import { createHandler } from '../../shared';
import { setCookie } from '../../shared/cookie/serialize';
import { jsonResponse, RequiredError } from '../../shared/response';
import { NetlifyEvent } from '../../shared/types';
import allowList from './allowlist.json';
import { createUserInDb } from './create';
import { renderTemplate } from './template';

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
      return formData.get(key) ?? undefined;
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

export const handler = createHandler(
  ['GET', 'POST'],
  async (event, context) => {
    const { auth, admin } = context.authContext;
    const formData = parseFormData(event);

    let redirectTo = new URL(formData.get('redirect_to') ?? '', baseURL);
    if (
      !redirectTo.host.endsWith('.hawaiibusplus.com') &&
      redirectTo.hostname !== 'localhost'
    ) {
      redirectTo = baseURL;
    }

    let successStatus = 201;
    let user: User;
    const type = formData.req('type');
    switch (type) {
      // Accept invite for new user
      case 'acceptInvite': {
        user = await auth.acceptInvite(
          formData.req('token'),
          formData.req('password')
        );
        const attributes = await createUserInDb(user);
        await admin.updateUser(user, attributes);
        break;
      }
      // Confirm email address
      case 'confirm': {
        user = await auth.confirm(formData.req('token'));
        break;
      }
      // Sign up new user
      case 'signup': {
        const email = formData.req('email').trim();
        if (!allowList.includes(email)) {
          return jsonResponse(403, {
            error: `Unauthorized: ${email} is not on allowlist. Sign up at https://hawaiibusplus.com to request an invite.`,
          });
        }
        const body = await auth.signup(email, formData.req('password'), {
          full_name: formData.get('name')?.trim(),
        });
        const attributes = await createUserInDb(body);
        await admin.updateUser(body, attributes);
        return renderTemplate(successStatus, {
          type: 'sentConfirmation',
        });
      }
      // Login existing user
      case 'login': {
        successStatus = 200;
        user = await auth.login(
          formData.req('email').trim(),
          formData.req('password')
        );
        break;
      }
      // Request a password recovery
      case 'requestPasswordRecovery': {
        await auth.requestPasswordRecovery(formData.req('email').trim());
        return renderTemplate(200, { type: 'sentConfirmation' });
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

    const response = await renderTemplate(successStatus, {
      type: 'success',
      redirectTo: redirectTo.href,
    });
    response.multiValueHeaders = {
      'Set-Cookie': await setCookie(user),
    };
    return response;
  }
);
