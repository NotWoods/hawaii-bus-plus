import { HTTPError } from '@hawaii-bus-plus/gotrue';
import { BinaryLike, createHash } from 'crypto';
import { readFile } from 'fs';
import { promisify } from 'util';
import { createHandler } from '../shared';
import { hasPaidAccess } from '../shared/role/paying';

const readFileAsync = promisify(readFile);

function getHash(str: BinaryLike) {
  const hash = createHash('sha256');
  hash.update(str);
  return hash.digest('hex');
}

function matchEntityTags(
  entityTags: string | undefined
): (eTag: string) => boolean {
  if (entityTags == undefined) {
    return () => false;
  } else if (entityTags === '*') {
    return () => true;
  } else {
    const storedTags = new Set(entityTags.split(',').map((h) => h.trim()));
    return (eTag) => storedTags.has(`"${eTag}"`);
  }
}

export const handler = createHandler('GET', async (event, context) => {
  const loggedInUser = await context.authContext.user();
  const userDetails = await loggedInUser?.getUserData();
  const payingOrTrialUser = userDetails && hasPaidAccess(userDetails);

  if (payingOrTrialUser) {
    const path = require.resolve(event.path.replace('/api/v1/', './'));
    const file = await readFileAsync(path, 'utf8');

    const matchETag = matchEntityTags(event.headers['if-none-match']);
    const entityTag = getHash(file);

    if (matchETag(entityTag)) {
      throw new HTTPError(304, 'Not Modified');
    } else {
      return {
        statusCode: 200,
        body: file,
        headers: {
          'Content-Type': 'application/json',
          ETag: entityTag,
        },
      };
    }
  } else if (userDetails) {
    // Logged in but not paying
    throw new HTTPError(402, 'Payment Required');
  } else {
    // Logged out
    throw new HTTPError(401, 'Unauthorized');
  }
});
