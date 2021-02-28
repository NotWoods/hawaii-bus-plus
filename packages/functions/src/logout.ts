import { createHandler } from '../shared';
import { removeCookie } from '../shared/cookie/serialize';

/**
 * Logout user
 */
export const handler = createHandler(['GET', 'POST'], async (_, context) => {
  const { currentUser } = context.authContext;
  if (currentUser) {
    await currentUser.logout();
  }

  return {
    statusCode: 302,
    body: '',
    headers: {
      Location: '/auth/login',
    },
    multiValueHeaders: {
      'Set-Cookie': removeCookie(),
    },
  };
});
