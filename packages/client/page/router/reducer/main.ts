import { MainRouterAction } from '../action/main';
import { MainState } from '../state';
import { DIRECTIONS_PATH, ROUTES_PREFIX } from '../state/main';

export function mainRouterReducer(
  state: MainState | undefined,
  action: MainRouterAction
): MainState | undefined {
  switch (action.type) {
    case 'route':
      return { path: ROUTES_PREFIX, routeId: action.routeId };
    case 'trip':
      return {
        path: ROUTES_PREFIX,
        routeId: action.routeId,
        tripId: action.tripId,
      };
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
      return state;
  }
}
