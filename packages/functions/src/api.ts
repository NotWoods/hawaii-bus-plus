import { BinaryLike, createHash } from 'crypto';
import { readFile } from 'fs';
import { promisify } from 'util';
import { recoverSession, refreshedOrNull } from '../shared/cookie/parse';
import { getAuth } from '../shared/identity/auth';
import { jsonResponse } from '../shared/response';
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
  if (event.httpMethod !== 'GET') {
    return jsonResponse(405, { error: 'Method Not Allowed' });
  }

  const { identity } = context.clientContext;
  const { auth } = getAuth(identity);
  const user = recoverSession(auth, event.headers);
  const loggedInUser = await refreshedOrNull(user);
  const userDetails = await loggedInUser?.getUserData();
  const payingOrTrialUser = userDetails && hasPaidAccess(userDetails);
  console.log('DEBUG HERE', user, loggedInUser, userDetails);

  if (payingOrTrialUser) {
    const path = require.resolve(event.path.replace('/api/v1/', './'));
    const file = await readFileAsync(path, 'utf8');

    const storedTags = event.headers['if-none-match']
      ?.split(',')
      ?.map((h) => h.trim());
    const eTag = getHash(file);

    if (storedTags?.some((stored) => stored === `"${eTag}"`)) {
      return jsonResponse(304, { error: 'Not Modified' });
    } else {
      return {
        statusCode: 200,
        body: file,
        headers: {
          'Content-Type': 'application/json',
          ETag: eTag,
        },
      };
    }
  } else if (userDetails) {
    // Logged in but not paying
    return jsonResponse(402, { error: 'Payment Required' });
  } else {
    // Logged out
    return jsonResponse(401, { error: 'Unauthorized' });
  }
}
