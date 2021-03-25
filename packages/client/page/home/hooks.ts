import { useContext } from 'preact/hooks';
import { MyLocationContext } from '../map/location/context';
import { RouterContext } from '../router/Router';

export type HomeButtonsError = { code: 401 | 402 | 'worker_start_error' };

export function isHomeButtonsError(err: unknown): err is HomeButtonsError {
  const error = err as { code?: unknown };
  return (
    error.code === 401 ||
    error.code === 402 ||
    error.code === 'worker_start_error'
  );
}

export function useHomeLocation(): google.maps.LatLngLiteral | undefined {
  const { point } = useContext(RouterContext);
  const { coords } = useContext(MyLocationContext);

  if (point && (point.type === 'marker' || point.type === 'user')) {
    return point.position;
  } else {
    return coords;
  }
}
