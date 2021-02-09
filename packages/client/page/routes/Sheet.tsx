import { h } from 'preact';
import { useContext } from 'preact/hooks';
import { DirectionsSheet2 } from '../directions/DirectionsSheet';
import { RouterContext } from '../router/Router';
import { RouteSheet } from './sheet/RouteSheet';

export function Sheet() {
  const { directions } = useContext(RouterContext);

  return directions?.journey ? (
    <DirectionsSheet2
      journey={directions.journey}
      timeZone="Pacific/Honolulu"
    />
  ) : (
    <RouteSheet />
  );
}
