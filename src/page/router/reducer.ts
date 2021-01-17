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

export function routerReducer(state: RouterState, action: RouterAction) {
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

      const newState = { ...state };

      // If link opens route (and trip)
      if (url.pathname.startsWith(ROUTES_PREFIX)) {
        const [routeId, tripIdOrBlank] = url.pathname
          .slice(ROUTES_PREFIX.length)
          .split('/');
        const tripId = tripIdOrBlank || undefined;
        if (routeId !== state.route_id) {
          newState.route_id = routeId;
          newState.route = undefined;
          newState.trip_id = tripId;
        } else if (tripId !== state.trip_id) {
          newState.trip_id = tripId;
        }
      }

      // If link opens stop
      const stopId = url.searchParams.get('stop') || undefined;
      if (stopId !== state.stop_id) {
        newState.stop_id = stopId;
        newState.stop = undefined;
      }

      return newState;
    default:
      throw new Error(`Invalid action`);
  }
}
