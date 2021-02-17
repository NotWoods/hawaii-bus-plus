import { Route, Stop } from '@hawaii-bus-plus/types';
import {
  STOP_POINT_TYPE,
  PLACE_POINT_TYPE,
  USER_POINT_TYPE,
  MARKER_POINT_TYPE,
  BIKE_POINT_TYPE,
} from '@hawaii-bus-plus/presentation';
import { RouterAction } from './action';
import { DIRECTIONS, RouterState, ROUTES_PREFIX } from './state';
import { queryToPoint } from './url';

export function initStateFromUrl(url: URL): RouterState {
  const newState: RouterState = { freshLoad: true };

  if (url.pathname.startsWith(DIRECTIONS)) {
    const depart = queryToPoint(url.searchParams.get('from'));
    const arrive = queryToPoint(url.searchParams.get('to'));
    const departureTime = url.searchParams.get('departureTime');
    if (depart && arrive && departureTime) {
      newState.main = {
        path: DIRECTIONS,
        depart,
        arrive,
        departureTime,
      };
    }
  } else if (url.pathname.startsWith(ROUTES_PREFIX)) {
    // If link opens route
    const [routeId] = url.pathname.slice(ROUTES_PREFIX.length).split('/');
    newState.main = {
      path: ROUTES_PREFIX,
      routeId: routeId as Route['route_id'],
    };
  }

  // If link opens stop
  const stopId = url.searchParams.get('stop');
  if (stopId) {
    newState.point = { type: 'stop', stopId: stopId as Stop['stop_id'] };
  }

  return newState;
}

function routerReducerInternal(
  state: Omit<RouterState, 'freshLoad'>,
  action: RouterAction
): Omit<RouterState, 'freshLoad'> {
  switch (action.type) {
    case 'route':
      return {
        ...state,
        main: { path: ROUTES_PREFIX, routeId: action.routeId },
      };
    case 'stop':
      return {
        ...state,
        point: { type: STOP_POINT_TYPE, stopId: action.stopId },
      };
    case 'bike-station':
      return {
        ...state,
        point: {
          type: BIKE_POINT_TYPE,
          stationId: action.stationId,
          name: action.name,
          position: action.position,
        },
      };
    case 'close-main':
      return { ...state, main: undefined };
    case 'close-point':
      return { ...state, point: undefined };
    case 'set-marker':
      return {
        ...state,
        point: { type: MARKER_POINT_TYPE, position: action.location },
      };
    case 'open-place':
      return {
        ...state,
        point: {
          type: PLACE_POINT_TYPE,
          placeId: action.placeId,
          position: action.position,
        },
      };
    case 'update-user-location':
      return {
        ...state,
        point: { type: USER_POINT_TYPE, position: action.location },
      };
    case 'link': {
      const { url } = action;
      if (url.hostname !== window.location.hostname) return state;

      const newState = initStateFromUrl(url);
      newState.freshLoad = false;
      return newState;
    }
    case 'open-journey':
      return {
        ...state,
        main: {
          path: DIRECTIONS,
          depart: action.depart,
          arrive: action.arrive,
          departureTime: action.departureTime,
          journey: action.journey,
        },
      };
  }
}

export function routerReducer(
  state: RouterState,
  action: RouterAction
): RouterState {
  const newState = routerReducerInternal(state, action) as RouterState;
  newState.freshLoad = false;
  return newState;
}
