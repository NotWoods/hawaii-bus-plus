import { Route, Stop } from '../../shared/gtfs-types';
import {
  closeRouteAction,
  closeStopAction,
  linkAction,
  openPlace,
  setMarker,
  setRouteAction,
  setStopAction,
  updateUserLocation,
} from './action';

export interface PlaceResult
  extends Omit<google.maps.places.PlaceResult, 'name' | 'geometry'> {
  name?: string;
  place_id: string;
  geometry: Pick<google.maps.places.PlaceGeometry, 'location'>;
}

export interface RouterState {
  route_id?: string;
  trip_id?: string;
  route?: Route;

  focus?: 'stop' | 'user' | 'place';
  stop_id?: string;
  stop?: Stop;

  user?: google.maps.LatLngLiteral;
  place_id?: string;
  place?: PlaceResult;
  marker?: google.maps.LatLngLiteral;
}

export type RouterAction =
  | ReturnType<typeof linkAction>
  | ReturnType<typeof setRouteAction>
  | ReturnType<typeof setStopAction>
  | ReturnType<typeof closeRouteAction>
  | ReturnType<typeof closeStopAction>
  | ReturnType<typeof setMarker>
  | ReturnType<typeof openPlace>
  | ReturnType<typeof updateUserLocation>;

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

export function routerReducer(
  state: RouterState,
  action: RouterAction
): RouterState {
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
        focus: 'stop',
        stop_id: stop.stop_id,
        stop,
      };
    case 'close-route':
      return {
        ...state,
        route_id: undefined,
        trip_id: undefined,
        route: undefined,
      };
    case 'close-stop':
      switch (state.focus) {
        case 'stop':
          return {
            ...state,
            focus: undefined,
            stop_id: undefined,
            stop: undefined,
          };
        case 'place':
          return {
            ...state,
            focus: undefined,
            place_id: undefined,
            place: undefined,
          };
        case 'user':
          return {
            ...state,
            focus: undefined,
            user: undefined,
          };
        default:
          return state;
      }
    case 'set-marker':
      return {
        ...state,
        focus: state.focus === 'place' ? undefined : state.focus,
        place_id: undefined,
        place: undefined,
        marker: action.location,
      };
    case 'open-place':
      return {
        ...state,
        focus: 'place',
        place_id: action.place.place_id,
        place: action.place,
        marker: undefined,
      };
    case 'update-user-location':
      return {
        ...state,
        focus: action.silent ? state.focus : 'user',
        user: action.location,
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
