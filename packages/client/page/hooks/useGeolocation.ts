import { useEffect, useState } from 'react';
import { locationFromIp } from '../map/location/ipstack';

function usePermission(permissionDesc: Parameters<Permissions['query']>[0]) {
  const [status, setStatus] = useState<PermissionState | undefined>();

  function handleChange(this: PermissionStatus) {
    setStatus(this.state);
  }

  useEffect(() => {
    let target: PermissionStatus | undefined;
    navigator.permissions.query(permissionDesc).then((t) => {
      target = t;
      target.addEventListener('change', handleChange);
    });

    return () => {
      target?.removeEventListener('change', handleChange);
    };
  }, [permissionDesc]);

  return status;
}

/**
 * Set up a worker that lasts as long as the component is mounted.
 * The worker is terminated afterwards.
 *
 * Returns a postMessage function.
 */
export function useGeolocation(active: boolean) {
  const status = usePermission({ name: 'geolocation' });
  const [coords, setCoordinates] = useState<
    Pick<GeolocationCoordinates, 'latitude' | 'longitude'> | undefined
  >();

  useEffect(() => {
    if (active) {
      const watchId = navigator.geolocation.watchPosition(
        function onGeolocationSuccess(pos) {
          setCoordinates(pos.coords);
        },
        async function onGeolocationError() {
          setCoordinates(await locationFromIp());
        }
      );
      return () => {
        navigator.geolocation.clearWatch(watchId);
      };
    } else {
      return undefined;
    }
  }, [active, status]);

  return coords;
}
