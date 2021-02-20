import { UserData } from 'gotrue-js';
import { jsonResponse } from '../shared/response';
import { NetlifyContext, NetlifyEvent, NetlifyResponse } from '../shared/types';

interface IdentityEvent {
  event: 'login' | 'signup' | 'validate';
  user: UserData;
}

// eslint-disable-next-line @typescript-eslint/require-await
export async function handler(
  event: NetlifyEvent,
  _context: NetlifyContext
): Promise<NetlifyResponse> {
  const { user } = JSON.parse(event.body!) as IdentityEvent;
  return jsonResponse(200, {
    app_metadata: {
      roles: ['trial'],
    },
    user_metadata: {
      ...user.user_metadata,
    },
  });
}
