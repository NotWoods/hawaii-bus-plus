import { readFile } from 'fs/promises';
import { join } from 'path';
import { NetlifyContext, NetlifyEvent, NetlifyResponse } from '../types';

export async function handler(
  event: NetlifyEvent,
  _context: NetlifyContext
): Promise<NetlifyResponse> {
  if (event.headers.authorization === `Bearer ${process.env.API_KEY}`) {
    const path = join(__dirname, event.path);
    console.log(path);
    const file = await readFile(path, 'utf8');
    return { statusCode: 200, body: file };
  } else {
    return { statusCode: 401, body: 'Unauthorized' };
  }
}
