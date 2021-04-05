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

type PartialResponse = Required<
  Pick<NetlifyResponse, 'headers' | 'multiValueHeaders'>
>;

function createAuthContext(
  event: NetlifyEvent,
  context: NetlifyContext,
  response: Required<Pick<NetlifyResponse, 'multiValueHeaders'>>,
) {
  const { identity } = context.clientContext;
  const authContext = getAuth(identity) as AuthContext;
  const currentUser = recoverSession(authContext.auth, event.headers);
  async function user() {
    if (!currentUser) return undefined;

    const currentToken = currentUser.tokenDetails().access_token;
    try {
      const refreshedToken = await currentUser.jwt();
      if (currentToken !== refreshedToken) {
        // Token has been changed, update user
        response.multiValueHeaders['Set-Cookie'] = await setCookie(currentUser);
      }
      return currentUser;
    } catch (err: unknown) {
      console.log('refresh error', err);
      response.multiValueHeaders['Set-Cookie'] = removeCookie();
      return undefined;
    }
  }
  authContext.currentUser = currentUser;
  authContext.user = user;
  return authContext;
}

/**
 * Convert error to Netlify response
 */
function errorToResponse(err: unknown): NetlifyResponse {
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

/**
 * Applies headers from `partialResponse` to `response`.
 * Both objects are mutated.
 *
 * If the same keys are present in `partialResponse.headers` and `response.headers`,
 * `response` will be used and the other value will be discarded.
 */
function mergePartialResponse(
  response: NetlifyResponse,
  partialResponse: PartialResponse,
) {
  response.headers = Object.assign(partialResponse.headers, response.headers);
  response.multiValueHeaders = Object.assign(
    partialResponse.multiValueHeaders,
    response.multiValueHeaders,
  );
}

export function createHandler(
  httpMethods: HttpMethod | readonly HttpMethod[],
  handler: (
    event: NetlifyEvent,
    context: Context,
  ) => NetlifyResponse | Promise<NetlifyResponse>,
) {
  const methods = new Set(
    Array.isArray(httpMethods) ? httpMethods : [httpMethods],
  );

  return async (
    event: NetlifyEvent,
    context: NetlifyContext,
  ): Promise<NetlifyResponse> => {
    if (!methods.has(event.httpMethod)) {
      return jsonResponse(405, { error: 'Method Not Allowed' });
    }

    const partialResponse: PartialResponse = {
      headers: {
        'Access-Control-Allow-Methods': Array.from(methods).join(', '),
      },
      multiValueHeaders: {},
    };
    const authContext = createAuthContext(event, context, partialResponse);

    let response: NetlifyResponse;
    try {
      const subContext: Context = { ...context, authContext };
      response = await handler(event, subContext);
    } catch (err: unknown) {
      response = errorToResponse(err);
    }
    mergePartialResponse(response, partialResponse);
    return response;
  };
}
