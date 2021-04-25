import { MainRouterAction } from '../action/main';
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
    case 'route':
      return {
        path: ROUTES_PREFIX,
        routeId: action.routeId,
        details: initialDetails,
      };
    case 'trip': {
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
    case 'open-journey':
      return {
        path: DIRECTIONS_PATH,
        depart: action.depart,
        arrive: action.arrive,
        departureTime: action.departureTime,
        journey: action.journey,
      };
    case 'close-main':
      return undefined;
    default:
      if (state?.path === ROUTES_PREFIX) {
        return openRouteReducer(state, action);
      } else {
        return state;
      }
  }
}
