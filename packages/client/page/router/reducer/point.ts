import {
  BIKE_POINT_TYPE,
  MARKER_POINT_TYPE,
  PLACE_POINT_TYPE,
  Point,
  STOP_POINT_TYPE,
  USER_POINT_TYPE,
} from '@hawaii-bus-plus/presentation';
import {
  CLOSE_POINT_TYPE,
  OPEN_PLACE_TYPE,
  PointRouterAction,
  SET_BIKE_STATION_TYPE,
  SET_MARKER_TYPE,
  SET_STOP_TYPE,
  UPDATE_USER_LOCATION_TYPE,
} from '../action/point';

export function pointRouterReducer(
  state: Point | undefined,
  action: PointRouterAction,
): Point | undefined {
  switch (action.type) {
    case SET_STOP_TYPE:
      return { type: STOP_POINT_TYPE, stopId: action.stopId };
    case SET_BIKE_STATION_TYPE:
      return {
        type: BIKE_POINT_TYPE,
        stationId: action.stationId,
        name: action.name,
        position: action.position,
      };
    case CLOSE_POINT_TYPE:
      return undefined;
    case SET_MARKER_TYPE:
      return { type: MARKER_POINT_TYPE, position: action.location };
    case OPEN_PLACE_TYPE:
      return {
        type: PLACE_POINT_TYPE,
        placeId: action.placeId,
        position: action.position,
      };
    case UPDATE_USER_LOCATION_TYPE:
      return { type: USER_POINT_TYPE, position: action.location };
    default:
      return state;
  }
}
