import { memoize } from '@hawaii-bus-plus/utils';
import { GeolocationErrorCode } from '../../hooks/useGeolocation';

class NullPositionError extends Error {
  code = GeolocationErrorCode.POSITION_UNAVAILABLE;
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

  const coords = json as {
    latitude?: number | null;
    longitude?: number | null;
  };
  if (coords.latitude != undefined && coords.longitude != undefined) {
    return coords as { latitude: number; longitude: number };
  } else {
    throw new NullPositionError();
  }
}

export const locationFromIp = memoize(requesterLookup);
