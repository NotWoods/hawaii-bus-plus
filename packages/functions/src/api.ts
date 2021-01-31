import { readFile } from 'fs';
import { join } from 'path';
import { promisify } from 'util';
import { NetlifyContext, NetlifyEvent, NetlifyResponse } from './types';

const readFileAsync = promisify(readFile);

export async function handler(
  event: NetlifyEvent,
  _context: NetlifyContext
): Promise<NetlifyResponse> {
  if (event.headers.authorization === `Bearer ${process.env.API_KEY}`) {
    const path = join(__dirname, '../', event.path);
    const file = await readFileAsync(path, 'utf8');
    return { statusCode: 200, body: file };
  } else {
    return { statusCode: 401, body: 'Unauthorized' };
  }
}
