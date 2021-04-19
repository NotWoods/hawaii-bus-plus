import {
  BIKE_POINT_TYPE,
  MARKER_POINT_TYPE,
  STOP_POINT_TYPE,
  USER_POINT_TYPE,
} from '@hawaii-bus-plus/presentation';
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
    (point.type === MARKER_POINT_TYPE || point.type === USER_POINT_TYPE)
  ) {
    return point;
  } else {
    return undefined;
  }
}

export function selectStop({ point }: Pick<RouterState, 'point'>) {
  if (point?.type === STOP_POINT_TYPE) {
    return point.stopId;
  } else {
    return undefined;
  }
}

export function selectBikeStation({ point }: Pick<RouterState, 'point'>) {
  if (point?.type === BIKE_POINT_TYPE) {
    return point.stationId;
  } else {
    return undefined;
  }
}
