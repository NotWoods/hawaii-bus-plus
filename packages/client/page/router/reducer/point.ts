import {
  BIKE_POINT_TYPE,
  MARKER_POINT_TYPE,
  PLACE_POINT_TYPE,
  Point,
  STOP_POINT_TYPE,
  USER_POINT_TYPE,
} from '@hawaii-bus-plus/presentation';
import { PointRouterAction } from '../action/point';

export function pointRouterReducer(
  state: Point | undefined,
  action: PointRouterAction,
): Point | undefined {
  switch (action.type) {
    case 'stop':
      return { type: STOP_POINT_TYPE, stopId: action.stopId };
    case 'bike-station':
      return {
        type: BIKE_POINT_TYPE,
        stationId: action.stationId,
        name: action.name,
        position: action.position,
      };
    case 'close-point':
      return undefined;
    case 'set-marker':
      return { type: MARKER_POINT_TYPE, position: action.location };
    case 'open-place':
      return {
        type: PLACE_POINT_TYPE,
        placeId: action.placeId,
        position: action.position,
      };
    case 'update-user-location':
      return { type: USER_POINT_TYPE, position: action.location };
    default:
      return state;
  }
}
