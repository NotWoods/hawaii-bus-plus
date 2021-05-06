import {
  CLOSE_MAIN_TYPE,
  MainRouterAction,
  OPEN_JOURNEY_TYPE,
  SET_ROUTE_TYPE,
  SET_TRIP_TYPE,
} from '../action/main';
import { MainState } from '../state';
import {
  DIRECTIONS_PATH,
  initialDetails,
  RouteDetailState,
  ROUTES_PREFIX,
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
        details = { ...state.details, selectedTrip: undefined };
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
