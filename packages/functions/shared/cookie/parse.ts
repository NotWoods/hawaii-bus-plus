import { APIGatewayProxyEventHeaders } from 'aws-lambda';
import * as cookie from 'cookie';
import { GoTrue, User } from '@hawaii-bus-plus/gotrue';
import { TokenUser } from '../identity/user';
import { JWT_ACCESS_TOKEN_KEY, JWT_REFRESH_TOKEN_KEY } from './serialize';

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
      return new TokenUser(auth, accessToken, refreshToken);
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
