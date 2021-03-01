import {
  Admin,
  GoTrue,
  HTTPError,
  JSONHTTPError,
  TextHTTPError,
  User,
} from '@hawaii-bus-plus/gotrue';
import { recoverSession } from './cookie/parse';
import { removeCookie, setCookie } from './cookie/serialize';
import { getAuth } from './identity/auth';
import { jsonResponse } from './response';
import { NetlifyContext, NetlifyEvent, NetlifyResponse } from './types';

type HttpMethod = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';

interface AuthContext {
  auth: GoTrue;
  admin: Admin;
  currentUser: User | undefined;
  user(): Promise<User | undefined>;
}

interface Context extends NetlifyContext {
  authContext: AuthContext;
}

export function createHandler(
  httpMethods: HttpMethod | readonly HttpMethod[],
  handler: (
    event: NetlifyEvent,
    context: Context
  ) => NetlifyResponse | Promise<NetlifyResponse>
) {
  const methods = new Set(
    Array.isArray(httpMethods) ? httpMethods : [httpMethods]
  );

  return async (
    event: NetlifyEvent,
    context: NetlifyContext
  ): Promise<NetlifyResponse> => {
    if (!methods.has(event.httpMethod)) {
      return jsonResponse(405, { error: 'Method Not Allowed' });
    }

    const { identity } = context.clientContext;
    const authContext = getAuth(identity) as AuthContext;
    const headers: NonNullable<NetlifyResponse['headers']> = {
      'Access-Control-Allow-Methods': Array.from(methods).join(', '),
    };
    const multiValueHeaders: NonNullable<
      NetlifyResponse['multiValueHeaders']
    > = {};

    const currentUser = recoverSession(authContext.auth, event.headers);
    async function user() {
      if (!currentUser) return undefined;

      const currentToken = currentUser.tokenDetails().access_token;
      try {
        const refreshedToken = await currentUser.jwt();
        if (currentToken !== refreshedToken) {
          // Token has been changed, update user
          multiValueHeaders['Set-Cookie'] = await setCookie(currentUser);
        }
        return currentUser;
      } catch (err: unknown) {
        multiValueHeaders['Set-Cookie'] = removeCookie();
        return undefined;
      }
    }
    authContext.currentUser = currentUser;
    authContext.user = user;

    try {
      const subContext: Context = { ...context, authContext };
      const response = await handler(event, subContext);
      response.headers = Object.assign(headers, response.headers);
      response.multiValueHeaders = Object.assign(
        multiValueHeaders,
        response.multiValueHeaders
      );
      console.log(response);
      return response;
    } catch (err: unknown) {
      if (err instanceof JSONHTTPError) {
        return jsonResponse(err.status, {
          error: err.message,
          json: err.json,
        });
      } else if (err instanceof TextHTTPError) {
        return jsonResponse(err.status, {
          error: err.message,
          data: err.data,
        });
      } else if (err instanceof HTTPError) {
        return jsonResponse(err.status, {
          error: err.message,
        });
      } else if (err instanceof Error) {
        return jsonResponse(500, {
          error: 'Internal Server Error',
          data: err.message,
        });
      } else {
        return jsonResponse(500, {
          error: 'Unknown server error',
        });
      }
    }
  };
}
