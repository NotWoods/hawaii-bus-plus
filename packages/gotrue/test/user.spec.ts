import test from 'ava';
import API from '../src/api/index.js';
import { Token } from '../src/api/interface.js';
import { User } from '../src/user.js';

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
  } as Token;
  const user = new User({} as API, tokenResponse, '');

  t.is(user.token.expires_at, 1000_000);
});
