import {
  CLOSE_MAIN_TYPE,
  OPEN_JOURNEY_TYPE,
  SET_ROUTE_TYPE,
  SET_TRIP_TYPE,
  type MainRouterAction,
} from '../action/main';
import type { MainState } from '../state';
import {
  DIRECTIONS_PATH,
  ROUTES_PREFIX,
  initialDetails,
  type RouteDetailState,
} from '../state/main';
import { openRouteReducer } from './routes';

export function mainRouterReducer(
  state: MainState | undefined,
  action: MainRouterAction,
): MainState | undefined {
  switch (action.type) {
    case SET_ROUTE_TYPE:
      return {
        path: ROUTES_PREFIX,
        routeId: action.routeId,
        details: initialDetails,
      };
    case SET_TRIP_TYPE: {
      let details: RouteDetailState;
      if (state?.path === ROUTES_PREFIX) {
        details = Object.assign({}, state.details);
        details.selectedTrip = undefined;
      } else {
        details = initialDetails;
      }
      return {
        path: ROUTES_PREFIX,
        routeId: action.routeId,
        tripId: action.tripId,
        details,
      };
    }
    case OPEN_JOURNEY_TYPE:
      return {
        path: DIRECTIONS_PATH,
        depart: action.depart,
        arrive: action.arrive,
        departureTime: action.departureTime,
        journey: action.journey,
      };
    case CLOSE_MAIN_TYPE:
      return undefined;
    default:
      if (state?.path === ROUTES_PREFIX) {
        return openRouteReducer(state, action);
      } else {
        return state;
      }
  }
}
