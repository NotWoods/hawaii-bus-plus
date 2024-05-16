import type { Stop } from '@hawaii-bus-plus/types';
import { LatLngBounds, type LatLngBoundsLiteral } from 'spherical-geometry-js';

export function boundsFromStops(
  stops: Iterable<Stop>,
): LatLngBoundsLiteral | undefined {
  let bounds: LatLngBounds | undefined;
  for (const stop of stops) {
    if (bounds) {
      bounds.extend(stop.position);
    } else {
      bounds = new LatLngBounds(stop.position, stop.position);
    }
  }
  return bounds?.toJSON();
}
