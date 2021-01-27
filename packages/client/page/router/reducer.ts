import { Point } from '@hawaii-bus-plus/presentation';
import { Stop } from '@hawaii-bus-plus/types';
import { RouterAction } from './action';

export interface PlaceResult
  extends Pick<
    google.maps.places.PlaceResult,
    'formatted_address' | 'place_id'
  > {
  name?: string;
  location?: google.maps.LatLngLiteral;
}

export interface RouterState {
  /** Open route */
  routeId?: string;

  /** Open stop */
  point?: Point;

  directionsOpen?: boolean;
}

const ROUTES_PREFIX = '/routes/';
const DIRECTIONS = '/directions/';

export function initStateFromUrl(url: URL) {
  const newState: RouterState = {};

  if (url.pathname.startsWith(DIRECTIONS)) {
    newState.directionsOpen = true;
  } else if (url.pathname.startsWith(ROUTES_PREFIX)) {
    // If link opens route
    const [routeId] = url.pathname.slice(ROUTES_PREFIX.length).split('/');
    newState.routeId = routeId;
  }

  // If link opens stop
  const stopId = url.searchParams.get('stop');
  if (stopId) {
    newState.point = { type: 'stop', stopId: stopId as Stop['stop_id'] };
  }

  return newState;
}

export function routerReducer(
  state: RouterState,
  action: RouterAction
): RouterState {
  switch (action.type) {
    case 'route':
      return { ...state, routeId: action.routeId };
    case 'stop':
      return { ...state, point: { type: 'stop', stopId: action.stopId } };
    case 'close-route':
      return { ...state, routeId: undefined };
    case 'close-point':
      return { ...state, point: undefined };
    case 'set-marker':
      return { ...state, point: { type: 'marker', position: action.location } };
    case 'open-place':
      return { ...state, point: action.point };
    case 'update-user-location':
      return { ...state, point: { type: 'user', position: action.location } };
    case 'link':
      const { url } = action;
      if (url.hostname !== window.location.hostname) return state;

      return initStateFromUrl(url);
    default:
      throw new Error(`Invalid action`);
  }
}
