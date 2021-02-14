import { PlacePointPartial, Point } from '@hawaii-bus-plus/presentation';
import { Route, Stop } from '@hawaii-bus-plus/types';
import type { Journey } from '../../worker-nearby/directions/format';
import { RouterAction } from './action';
import { queryToPoint } from './url';

export interface PlaceResult
  extends Pick<
    google.maps.places.PlaceResult,
    'formatted_address' | 'place_id'
  > {
  name?: string;
  location?: google.maps.LatLngLiteral;
}

export interface DirectionsState {
  depart: Point | PlacePointPartial;
  arrive: Point | PlacePointPartial;
  departureTime: string;
  journey?: Journey;
}

export interface RouterState {
  /** Open route */
  routeId?: Route['route_id'];

  /** Open stop */
  point?: Point;

  directions?: DirectionsState;

  freshLoad: boolean;
}

const ROUTES_PREFIX = '/routes/';
const DIRECTIONS = '/directions';

export function initStateFromUrl(url: URL) {
  const newState: RouterState = { freshLoad: true };

  if (url.pathname.startsWith(DIRECTIONS)) {
    const depart = queryToPoint(url.searchParams.get('from'));
    const arrive = queryToPoint(url.searchParams.get('to'));
    const departureTime = url.searchParams.get('departureTime');
    if (depart && arrive && departureTime) {
      newState.directions = { depart, arrive, departureTime };
    }
  } else if (url.pathname.startsWith(ROUTES_PREFIX)) {
    // If link opens route
    const [routeId] = url.pathname.slice(ROUTES_PREFIX.length).split('/');
    newState.routeId = routeId as Route['route_id'];
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
      return { ...state, routeId: action.routeId, freshLoad: false };
    case 'stop':
      return { ...state, point: { type: 'stop', stopId: action.stopId } };
    case 'bike-station':
      return {
        ...state,
        point: {
          type: 'bike',
          stationId: action.stationId,
          name: action.name,
          position: action.position!,
        },
      };
    case 'close-route':
      return { ...state, routeId: undefined, freshLoad: false };
    case 'close-point':
      return { ...state, point: undefined, freshLoad: false };
    case 'close-journey':
      return { ...state, directions: undefined, freshLoad: false };
    case 'set-marker':
      return { ...state, point: { type: 'marker', position: action.location } };
    case 'open-place':
      return { ...state, point: action.point };
    case 'update-user-location':
      return { ...state, point: { type: 'user', position: action.location } };
    case 'link': {
      const { url } = action;
      if (url.hostname !== window.location.hostname) return state;

      const newState = initStateFromUrl(url);
      newState.freshLoad = false;
      return newState;
    }
    case 'open-journey':
      return { ...state, directions: action, freshLoad: false };
  }
}
