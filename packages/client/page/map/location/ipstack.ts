import { memoize } from '@hawaii-bus-plus/utils';

// TODO move to server
async function requesterLookup(signal?: AbortSignal) {
  try {
    const res = await fetch('/api/ipstack', {
      signal,
    });
    const json = await res.json();
    return json as Pick<GeolocationCoordinates, 'latitude' | 'longitude'>;
  } catch (err) {
    console.warn(err);
    throw err;
  }
}

export const locationFromIp = memoize(requesterLookup);
