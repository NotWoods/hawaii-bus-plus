import { GTFSData } from '@hawaii-bus-plus/types';

export class UnauthorizedError extends Error {
  name = 'UnauthorizedError';
  code = 401;
}

export class PaymentRequiredError extends Error {
  name = 'PaymentRequiredError';
  code = 402;
}

export class ETagMatchError extends Error {
  name = 'ETagMatchError';
  code = 208;
}

interface DownloadOptions {
  signal?: AbortSignal;
  storedTag?: Promise<string | undefined>;
}

export async function downloadScheduleData({
  signal,
  storedTag,
}: DownloadOptions = {}): Promise<{ api: GTFSData; eTag?: string }> {
  const res = await fetch('/api/v1/api.json', {
    signal,
    credentials: 'same-origin',
  });

  if (!res.ok) {
    if (res.status === 401) {
      throw new UnauthorizedError(res.statusText);
    } else if (res.status === 402) {
      throw new PaymentRequiredError(res.statusText);
    } else {
      throw new Error(res.statusText);
    }
  }

  const eTag = res.headers.get('ETag') ?? undefined;
  if (storedTag) {
    const tag = await storedTag;
    if (tag && eTag && tag === eTag) {
      // we've already cached this value
      throw new ETagMatchError();
    }
  }

  const json = await res.json();
  const api = json as GTFSData;
  return { api, eTag };
}
