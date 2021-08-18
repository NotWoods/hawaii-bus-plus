import { useContext } from 'preact/hooks';
import { LatLngLiteral } from 'spherical-geometry-js';
import { MyLocationContext } from '../../map/location/context';
import { useSelector } from '../../router/hooks';
import { selectUserPoint } from '../../router/selector/point';

export type HomeButtonsError = { code: 401 | 402 };

export function isHomeButtonsError(err: unknown): err is HomeButtonsError {
  const error = err as { code?: unknown };
  return error.code === 401 || error.code === 402;
}

export function useHomeLocation(): LatLngLiteral | undefined {
  const point = useSelector(selectUserPoint);
  const { coords } = useContext(MyLocationContext);

  return point?.position ?? coords;
}
