import { useEffect, useState } from 'react';

/**
 * Set up a worker that lasts as long as the component is mounted.
 * The worker is terminated afterwards.
 *
 * Returns a postMessage function.
 */
export function useGeolocation(watch: boolean) {
  const [position, setPosition] = useState<GeolocationPosition | undefined>();
  const [error, setError] = useState<GeolocationPositionError | undefined>();

  useEffect(() => {
    if (watch) {
      const watchId = navigator.geolocation.watchPosition(
        setPosition,
        setError
      );
      return () => navigator.geolocation.clearWatch(watchId);
    } else {
      return undefined;
    }
  }, [watch]);

  return [position, error];
}
