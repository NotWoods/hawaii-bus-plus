import { memoize } from '@hawaii-bus-plus/utils';

export interface Coordinates {
  latitude?: number | null;
  longitude?: number | null;
}

async function requesterLookup(signal?: AbortSignal) {
  let json: unknown;
  try {
    const res = await fetch('/api/v1/lookup_location', {
      signal,
    });
    if (!res.ok) {
      throw new Error(res.statusText);
    }

    json = await res.json();
  } catch (err: unknown) {
    console.warn(err);
    throw err;
  }

  return json as Coordinates;
}

export const locationFromIp = memoize(requesterLookup);
