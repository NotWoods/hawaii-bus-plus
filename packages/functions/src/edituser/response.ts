import { NetlifyResponse } from '../../types';

export function jsonResponse(
  statusCode: number,
  body: unknown
): NetlifyResponse {
  return {
    statusCode,
    body: JSON.stringify(body),
    headers: {
      'Content-Type': 'application/json',
    },
  };
}

export class RequiredError extends Error {}
