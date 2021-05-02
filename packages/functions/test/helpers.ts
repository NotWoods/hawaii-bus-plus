import { AuthContext, MOCK_AUTH_CONTEXT } from '../shared/index.js';
import { NetlifyContext, NetlifyEvent } from '../shared/types.js';

export function mockEvent(base?: Partial<NetlifyEvent>): NetlifyEvent {
  return {
    httpMethod: 'GET',
    headers: {},
    multiValueHeaders: {},
    ...base,
  } as NetlifyEvent;
}

export function mockContext(
  base?: Partial<NetlifyContext>,
  auth?: Partial<AuthContext>,
): NetlifyContext {
  return {
    ...base,
    [MOCK_AUTH_CONTEXT]: {
      ...auth,
    },
  } as NetlifyContext & { [MOCK_AUTH_CONTEXT]: AuthContext };
}
