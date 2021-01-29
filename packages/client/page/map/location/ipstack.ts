import { memoize } from '@hawaii-bus-plus/utils';

// TODO move to server
async function requesterLookup(signal?: AbortSignal) {
  const url = new URL('http://api.ipstack.com/check');
  url.searchParams.set(
    'access_key',
    import.meta.env.VITE_IPSTACK_KEY as string
  );
  url.searchParams.set('fields', 'latitude,longitude');

  try {
    const res = await fetch(url.href, { signal });
    const json = await res.json();
    return json as Pick<GeolocationCoordinates, 'latitude' | 'longitude'>;
  } catch (err) {
    console.warn(err);
    throw err;
  }
}

export const locationFromIp = memoize(requesterLookup);
