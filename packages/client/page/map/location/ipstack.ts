import { memoize } from '@hawaii-bus-plus/utils';

async function requesterLookup(signal?: AbortSignal) {
  try {
    const res = await fetch('/api/v1/lookup_location', {
      signal,
    });
    if (!res.ok) {
      throw new Error(res.statusText);
    }

    const json = await res.json();
    return json as Pick<GeolocationCoordinates, 'latitude' | 'longitude'>;
  } catch (err: unknown) {
    console.warn(err);
    throw err;
  }
}

export const locationFromIp = memoize(requesterLookup);
