import { URL } from 'url';
import { NetlifyEvent } from '../types';

export function getReferrer(event: NetlifyEvent) {
  return event.headers['referer']
    ? new URL(event.headers['referer'])
    : undefined;
}
