import { GoTrue } from '@hawaii-bus-plus/gotrue';
import test from 'ava';
import { TokenUser } from '../../../shared/identity/user.js';

test('should parse token in ctor', (t) => {
  //
  // {
  // "sub": "1234567890",
  // "name": "John Doe",
  // "iat": 1516239022,
  // "exp": 1000
  // }
  //
  const tokenResponse = {
    access_token:
      'header.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyLCJleHAiOjEwMDB9.secret',
  };
  const user = new TokenUser({ api: {} } as GoTrue, tokenResponse.access_token);

  t.is(user.token.expires_at, 1000000);
});
