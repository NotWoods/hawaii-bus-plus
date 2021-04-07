import { createHandler } from '../shared';
import { formatUser } from '../shared/response';

const defaultOrigin = 'https://app.hawaiibusplus.com';
const allowedOrigins = new Set([defaultOrigin, 'https://hawaiibusplus.com']);

/**
 * Retrieve user data
 */
export const handler = createHandler('GET', async (event, context) => {
  const requestOrigin = event.headers['origin']!;
  const responseHeaders = {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': allowedOrigins.has(requestOrigin)
      ? requestOrigin
      : defaultOrigin,
    'Access-Control-Allow-Credentials': 'true',
    'Cross-Origin-Resource-Policy': 'same-site',
    Vary: 'Origin',
  };

  const loggedInUser = await context.authContext.user();
  if (!loggedInUser) {
    return {
      statusCode: 401,
      body: JSON.stringify({
        error: 'Unauthorized',
        data: 'Not logged in',
      }),
      headers: responseHeaders,
    };
  }

  const userData = await formatUser(loggedInUser);

  return {
    statusCode: 200,
    body: JSON.stringify(userData),
    headers: responseHeaders,
  };
});
