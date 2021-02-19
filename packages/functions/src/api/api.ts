import { readFile } from 'fs';
import { createHash, BinaryLike } from 'crypto';
import { promisify } from 'util';
import GoTrue from 'gotrue-js';
import { NetlifyContext, NetlifyEvent, NetlifyResponse } from '../../types';

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
  const auth = new GoTrue({
    APIUrl: identity.url,
    setCookie: true,
  });

  if (event.headers.authorization === `Bearer ${process.env.API_KEY || ''}`) {
    const path = require.resolve(event.path.replace('/api/v1/', './'));
    console.log(event.path, path);
    const file = await readFileAsync(path, 'utf8');
    return {
      statusCode: 200,
      body: file,
      headers: {
        'Content-Type': 'application/json',
        ETag: getHash(file),
      },
    };
  } else {
    return {
      statusCode: 401,
      body: JSON.stringify({ error: 'Unauthorized' }),
      headers: { 'Content-Type': 'application/json' },
    };
  }
}
