import { useEffect, useState } from 'preact/hooks';
import { locationFromIp } from '../map/location/ipstack';

export type GeolocationErrorCode = typeof GeolocationErrorCode[keyof typeof GeolocationErrorCode];
export const GeolocationErrorCode = {
  NOT_YET_LOADED: -1,
  PERMISSION_DENIED: 1,
  POSITION_UNAVAILABLE: 2,
  TIMEOUT: 3,
} as const;

export function usePermission(
  permissionDesc: Parameters<Permissions['query']>[0]
) {
  const [status, setStatus] = useState<PermissionState | undefined>();

  function handleChange(this: PermissionStatus) {
    setStatus(this.state);
  }

  useEffect(() => {
    let target: PermissionStatus | undefined;
    navigator.permissions
      .query(permissionDesc)
      .then((t) => {
        setStatus(t.state);
        target = t;
        target.addEventListener('change', handleChange);
      })
      .catch((err) => console.error(err));

    return () => {
      target?.removeEventListener('change', handleChange);
    };
  }, [permissionDesc]);

  return status;
}

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
        function onGeolocationError() {
          locationFromIp().then(setCoordinates, (err) => console.error(err));
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
