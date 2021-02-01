import { readFile } from 'fs';
import { promisify } from 'util';
import { NetlifyContext, NetlifyEvent, NetlifyResponse } from '../../types';

const readFileAsync = promisify(readFile);

export async function handler(
  event: NetlifyEvent,
  _context: NetlifyContext
): Promise<NetlifyResponse> {
  if (event.headers.authorization === `Bearer ${process.env.API_KEY}`) {
    const path = require.resolve(event.path.replace('/api/v1/', './'));
    console.log(event.path, path);
    const file = await readFileAsync(path, 'utf8');
    return {
      statusCode: 200,
      body: file,
      headers: { 'Content-Type': 'application/json' },
    };
  } else {
    return {
      statusCode: 401,
      body: JSON.stringify({ error: 'Unauthorized' }),
      headers: { 'Content-Type': 'application/json' },
    };
  }
}
