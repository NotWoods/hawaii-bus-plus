import { APIGatewayProxyEventHeaders } from 'aws-lambda';
import * as cookie from 'cookie';
import GoTrue, { User, Token } from 'gotrue-js';

// Netlify's JWT cookie key
const JWT_ACCESS_TOKEN_KEY = 'nf_jwt';
const JWT_REFRESH_TOKEN_KEY = 'nf_jwt_refresh';

const serializeOptions: cookie.CookieSerializeOptions = {
  httpOnly: true,
  sameSite: 'lax',
  secure: true,
};

class CookieUser extends User {
  constructor(auth: GoTrue, accessToken: string, refreshToken?: string) {
    // This is enough for gotrue to work with.
    // expires_at is populated using the access token.
    const tokenResponse: Partial<Token> = {
      access_token: accessToken,
      refresh_token: refreshToken,
    };
    super(auth.api, tokenResponse, auth.audience);
  }

  /**
   * Refresh the access token using the refresh token.
   * If refresh token isn't set, an error is thrown early.
   */
  _refreshToken(refreshToken?: string) {
    if (!refreshToken) {
      throw new Error('Missing refresh token, cannot refresh expired JWT');
    }
    return super._refreshToken(refreshToken);
  }
}

/**
 * Returns cookies used to represent a JWT.
 * @example
 * multiValueHeaders: {
 *   'Set-Cookie': await setCookie(user)
 * }
 */
export async function setCookie(user: User) {
  const token = await user.jwt();
  const accessTokenCookie = cookie.serialize(
    JWT_ACCESS_TOKEN_KEY,
    token,
    serializeOptions
  );
  const refreshTokenCookie = cookie.serialize(
    JWT_REFRESH_TOKEN_KEY,
    user.tokenDetails().refresh_token,
    serializeOptions
  );

  return [accessTokenCookie, refreshTokenCookie];
}

/**
 * Returns a user object corresponding to the logged in user.
 * @example
 * const user = recoverSession(auth, event.headers)
 */
export function recoverSession(
  auth: GoTrue,
  headers: APIGatewayProxyEventHeaders
) {
  const cookies = cookie.parse(headers['cookie'] ?? '');
  const accessToken: string | undefined = cookies[JWT_ACCESS_TOKEN_KEY];
  const refreshToken: string | undefined = cookies[JWT_REFRESH_TOKEN_KEY];

  // Based on User.recoverSession
  if (accessToken) {
    try {
      return new CookieUser(auth, accessToken, refreshToken);
    } catch (err: unknown) {
      console.error(`Error recovering session`, err);
      return undefined;
    }
  }

  return undefined;
}

/**
 * Returns undefined if the user fails to get a current access token.
 */
export async function refreshedOrNull(user?: User) {
  if (!user) return undefined;
  try {
    await user.jwt();
    return user;
  } catch (err: unknown) {
    return undefined;
  }
}
