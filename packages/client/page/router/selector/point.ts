import { BIKE_POINT_TYPE } from '@hawaii-bus-plus/presentation';
import { StationInformation } from '@hawaii-bus-plus/types';
import { RouterState } from '../state';

export function selectPoint(state: Pick<RouterState, 'point'>) {
  return state.point;
}

/**
 * Select points representing user location - either physical location or clicked location.
 * These points do not open a details pane.
 */
export function selectUserPoint({ point }: Pick<RouterState, 'point'>) {
  if (
    point != undefined &&
    (point.type === 'marker' || point.type === 'user')
  ) {
    return point;
  } else {
    return undefined;
  }
}

export function selectBikeStation({
  point,
}: Pick<RouterState, 'point'>): StationInformation['station_id'] | undefined {
  if (point?.type === BIKE_POINT_TYPE) {
    return point.stationId;
  } else {
    return undefined;
  }
}
