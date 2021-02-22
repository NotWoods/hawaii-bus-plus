import { BinaryLike, createHash } from 'crypto';
import { readFile } from 'fs';
import { promisify } from 'util';
import { recoverSession, refreshedOrNull } from '../shared/cookie/parse';
import { getAuth } from '../shared/identity/auth';
import { hasPaidAccess } from '../shared/role/paying';
import { NetlifyContext, NetlifyEvent, NetlifyResponse } from '../shared/types';

const readFileAsync = promisify(readFile);

function getHash(str: BinaryLike) {
  const hash = createHash('sha256');
  hash.update(str);
  return hash.digest('hex');
}

export async function handler(
  event: NetlifyEvent,
  context: NetlifyContext
): Promise<NetlifyResponse> {
  const { identity } = context.clientContext;
  const auth = getAuth(identity);
  const loggedInUser = await refreshedOrNull(
    recoverSession(auth, event.headers)
  );
  const userDetails = await loggedInUser?.getUserData();
  const payingOrTrialUser = userDetails && hasPaidAccess(userDetails);
  console.log(userDetails);

  if (payingOrTrialUser) {
    const path = require.resolve(event.path.replace('/api/v1/', './'));
    console.log(userDetails);
    const file = await readFileAsync(path, 'utf8');
    return {
      statusCode: 200,
      body: file,
      headers: {
        'Content-Type': 'application/json',
        ETag: getHash(file),
      },
    };
  } else if (userDetails) {
    // Logged in but not paying
    return {
      statusCode: 402,
      body: JSON.stringify({ error: 'Payment Required' }),
      headers: { 'Content-Type': 'application/json' },
    };
  } else {
    // Logged out
    return {
      statusCode: 401,
      body: JSON.stringify({ error: 'Unauthorized' }),
      headers: { 'Content-Type': 'application/json' },
    };
  }
}
