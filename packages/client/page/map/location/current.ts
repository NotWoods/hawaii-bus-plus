import { locationFromIp } from './ipstack';

export function getCurrentPosition(options?: PositionOptions) {
  return new Promise<GeolocationPosition>((resolve, reject) =>
    navigator.geolocation.getCurrentPosition(resolve, reject, options)
  );
}

function isGeolocationError(error: unknown): error is GeolocationPositionError {
  return (error as any).code > 0;
}

/**
 * Get position from Geolocation API,
 * falling back to guessing it from the IP address.
 */
export async function getPosition() {
  navigator.permissions.query({ name: 'geolocation' });
  try {
    const position = await getCurrentPosition();
    return position.coords;
  } catch (err: unknown) {
    if (isGeolocationError(err)) {
      const ipPosition = await locationFromIp();
      return ipPosition;
    } else {
      throw err;
    }
  }
}
