import GoTrue from 'gotrue-js';
import { NetlifyContext, NetlifyEvent, NetlifyResponse } from '../../types';

export async function handler(
  event: NetlifyEvent,
  context: NetlifyContext
): Promise<NetlifyResponse> {
  const { identity } = context.clientContext;
  const auth = new GoTrue({
    APIUrl: identity.url,
    setCookie: true,
  });

  auth.signup();
}
