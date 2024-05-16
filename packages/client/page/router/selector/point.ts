import {
  BIKE_POINT_TYPE,
  MARKER_POINT_TYPE,
  STOP_POINT_TYPE,
  USER_POINT_TYPE,
  type BikeStationPoint,
  type PlacePoint,
  type StopPoint,
} from '@hawaii-bus-plus/presentation';
import type { RouterState } from '../state';

export function selectPoint(state: Pick<RouterState, 'point'>) {
  return state.point;
}

export function selectPointDetailsOpen({
  point,
}: Pick<RouterState, 'point'>):
  | StopPoint
  | PlacePoint
  | BikeStationPoint
  | undefined {
  switch (point?.type) {
    case 'stop':
    case 'place':
    case 'bike':
      return point;
    default:
      return undefined;
  }
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
