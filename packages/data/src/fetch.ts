import type { GTFSData } from '@hawaii-bus-plus/types';

export class UnauthorizedError extends Error {
  name = 'UnauthorizedError';
  code = 401;
}

export class PaymentRequiredError extends Error {
  name = 'PaymentRequiredError';
  code = 402;
}

export class NotModifiedError extends Error {
  name = 'NotModifiedError';
  code = 304;
}

interface DownloadOptions {
  signal?: AbortSignal;
  storedTag?: string;
}

export async function downloadScheduleData({
  signal,
  storedTag,
}: DownloadOptions = {}): Promise<{ api: GTFSData; eTag?: string }> {
  const headers = new Headers();
  if (storedTag) {
    headers.set('If-None-Match', `"${storedTag}"`);
    headers.set('X-If-None-Match', `"${storedTag}"`);
  }

  const res = await fetch('/api/v1/api.json', {
    signal,
    credentials: 'same-origin',
    headers,
  });

  if (!res.ok) {
    if (res.status === 401) {
      throw new UnauthorizedError(res.statusText);
    } else if (res.status === 402) {
      throw new PaymentRequiredError(res.statusText);
    } else if (res.status === 304) {
      throw new NotModifiedError(res.statusText);
    } else {
      throw new Error(res.statusText);
    }
  }

  const eTag = res.headers.get('ETag') ?? undefined;
  if (storedTag && eTag && storedTag === eTag) {
    // we've already cached this value
    throw new NotModifiedError();
  }

  const json = await res.json();
  const api = json as GTFSData;
  return { api, eTag };
}
