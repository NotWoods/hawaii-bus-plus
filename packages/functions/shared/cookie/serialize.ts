import { User } from '@hawaii-bus-plus/gotrue';
import * as cookie from 'cookie';

// Netlify's JWT cookie key
export const JWT_ACCESS_TOKEN_KEY = 'nf_jwt';
export const JWT_REFRESH_TOKEN_KEY = 'nf_jwt_refresh';

const SECONDS_IN_DAY = 86400;

const serializeOptions: cookie.CookieSerializeOptions = {
  httpOnly: true,
  sameSite: 'lax',
  secure: true,
  path: '/',
  maxAge: 30 * SECONDS_IN_DAY,
};

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
    serializeOptions,
  );
  const refreshTokenCookie = cookie.serialize(
    JWT_REFRESH_TOKEN_KEY,
    user.tokenDetails().refresh_token,
    serializeOptions,
  );

  return [accessTokenCookie, refreshTokenCookie];
}

export function removeCookie() {
  const accessTokenCookie = cookie.serialize(JWT_ACCESS_TOKEN_KEY, '', {
    ...serializeOptions,
    maxAge: 0,
  });
  const refreshTokenCookie = cookie.serialize(JWT_REFRESH_TOKEN_KEY, '', {
    ...serializeOptions,
    maxAge: 0,
  });

  return [accessTokenCookie, refreshTokenCookie];
}
