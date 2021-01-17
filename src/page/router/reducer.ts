import { Route, Stop } from '../../shared/gtfs-types';
import {
  closeStopAction,
  linkAction,
  setRouteAction,
  setStopAction,
} from './action';

export interface RouterState {
  route_id?: string;
  trip_id?: string;
  route?: Route;
  stop_id?: string;
  stop?: Stop;
}

export type RouterAction =
  | ReturnType<typeof linkAction>
  | ReturnType<typeof setRouteAction>
  | ReturnType<typeof setStopAction>
  | ReturnType<typeof closeStopAction>;

const ROUTES_PREFIX = '/routes/';

export function initStateFromUrl(url: URL) {
  const newState: RouterState = {};

  // If link opens route (and trip)
  if (url.pathname.startsWith(ROUTES_PREFIX)) {
    const [routeId, tripIdOrBlank] = url.pathname
      .slice(ROUTES_PREFIX.length)
      .split('/');
    newState.route_id = routeId;
    newState.trip_id = tripIdOrBlank || undefined;
  }

  // If link opens stop
  newState.stop_id = url.searchParams.get('stop') || undefined;

  return newState;
}

export function routerReducer(state: RouterState, action: RouterAction) {
  console.log(action);
  switch (action.type) {
    case 'route':
      const { route } = action;
      return {
        ...state,
        route_id: route.route_id,
        route,
      };
    case 'stop':
      const { stop } = action;
      return {
        ...state,
        stop_id: stop.stop_id,
        stop,
      };
    case 'close-stop':
      return {
        ...state,
        stop_id: undefined,
        stop: undefined,
      };
    case 'link':
      const { url } = action;
      if (url.hostname !== window.location.hostname) return state;

      const newState: RouterState = initStateFromUrl(url);
      if (newState.route_id === state.route_id) {
        newState.route = state.route;
      }
      if (newState.stop_id === state.stop_id) {
        newState.stop = state.stop;
      }

      return newState;
    default:
      throw new Error(`Invalid action`);
  }
}
