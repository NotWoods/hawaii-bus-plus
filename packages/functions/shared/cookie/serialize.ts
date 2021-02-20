import * as cookie from 'cookie';
import { User } from 'gotrue-js';

// Netlify's JWT cookie key
export const JWT_ACCESS_TOKEN_KEY = 'nf_jwt';
export const JWT_REFRESH_TOKEN_KEY = 'nf_jwt_refresh';

const serializeOptions: cookie.CookieSerializeOptions = {
  httpOnly: true,
  sameSite: 'lax',
  secure: true,
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
    serializeOptions
  );
  const refreshTokenCookie = cookie.serialize(
    JWT_REFRESH_TOKEN_KEY,
    user.tokenDetails().refresh_token,
    serializeOptions
  );

  return [accessTokenCookie, refreshTokenCookie];
}

export function removeCookie() {
  // 1 hour ago
  const past = new Date(Date.now() - 3600_000);
  const accessTokenCookie = cookie.serialize(JWT_ACCESS_TOKEN_KEY, '', {
    ...serializeOptions,
    expires: past,
  });
  const refreshTokenCookie = cookie.serialize(JWT_REFRESH_TOKEN_KEY, '', {
    ...serializeOptions,
    expires: past,
  });

  return [accessTokenCookie, refreshTokenCookie];
}
