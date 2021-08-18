import { NetlifyResponse } from '../types';

export function jsonResponse(
  statusCode: number,
  body: unknown,
  headers: {
    [header: string]: string;
  } = {},
): NetlifyResponse {
  return {
    statusCode,
    body: JSON.stringify(body),
    headers: {
      'Content-Type': 'application/json',
      ...headers,
    },
  };
}
