import test from 'ava';
import {
  AuthContext,
  Context,
  createHandler,
  MOCK_AUTH_CONTEXT,
} from '../../shared/index.js';
import { NetlifyContext } from '../../shared/types.js';
import { mockContext, mockEvent } from '../helpers.js';

test('mock auth context', async (t) => {
  const mockAuthContext = {} as AuthContext;

  let context: Context | undefined;
  const handler = createHandler('GET', (_, ctx) => {
    context = ctx;
    return { statusCode: 200, body: '' };
  });

  t.is(context, undefined);

  await handler(mockEvent(), {
    [MOCK_AUTH_CONTEXT]: mockAuthContext,
  } as unknown as NetlifyContext);
  t.truthy(context);
  t.is(context!.authContext, mockAuthContext);
});

test('verify method with single string', async (t) => {
  const handler = createHandler('GET', () => ({ statusCode: 200, body: '' }));

  const error = await handler(mockEvent({ httpMethod: 'POST' }), mockContext());
  t.is(error.statusCode, 405);

  const success = await handler(
    mockEvent({ httpMethod: 'GET' }),
    mockContext(),
  );
  t.is(success.statusCode, 200);
  t.is(success.headers!['Access-Control-Allow-Methods'], 'GET');
});

test('verify method with string array', async (t) => {
  const handler = createHandler(['GET', 'DELETE'], () => ({
    statusCode: 200,
    body: '',
  }));
  const error = await handler(mockEvent({ httpMethod: 'POST' }), mockContext());
  t.is(error.statusCode, 405);

  const successful = await Promise.all([
    handler(mockEvent({ httpMethod: 'GET' }), mockContext()),
    handler(mockEvent({ httpMethod: 'DELETE' }), mockContext()),
  ]);
  for (const success of successful) {
    t.is(success.statusCode, 200);
    t.is(success.headers!['Access-Control-Allow-Methods'], 'GET, DELETE');
  }
});
