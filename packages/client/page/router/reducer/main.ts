import { RouterAction } from '../action';
import { MainRouterAction } from '../action/main';
import { MainState } from '../state';
import { DIRECTIONS, ROUTES_PREFIX } from '../state/main';

export function mainRouterReducer(
  state: MainState | undefined,
  action: MainRouterAction | RouterAction
): MainState | undefined {
  switch (action.type) {
    case 'route':
      return { path: ROUTES_PREFIX, routeId: action.routeId };
    case 'open-journey':
      return {
        path: DIRECTIONS,
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
