import { Route, Stop, Trip } from '@hawaii-bus-plus/types';
import { RouterAction } from '../action';
import { MainRouterAction } from '../action/main';
import { PointRouterAction } from '../action/point';
import { DIRECTIONS_PATH, RouterState, ROUTES_PREFIX } from '../state';
import { queryToPoint } from '../url';
import { mainRouterReducer } from './main';
import { pointRouterReducer } from './point';

export function initStateFromUrl(url: URL): RouterState {
  const newState: RouterState = { freshLoad: true };

  if (url.pathname.startsWith(DIRECTIONS_PATH)) {
    const depart = queryToPoint(url.searchParams.get('from'));
    const arrive = queryToPoint(url.searchParams.get('to'));
    const departureTime = url.searchParams.get('departureTime');
    if (depart && arrive && departureTime) {
      newState.main = {
        path: DIRECTIONS_PATH,
        depart,
        arrive,
        departureTime,
      };
    }
  } else if (url.pathname.startsWith(ROUTES_PREFIX)) {
    // If link opens route
    const [routeId, tripId] = url.pathname
      .slice(ROUTES_PREFIX.length)
      .split('/');
    newState.main = {
      path: ROUTES_PREFIX,
      routeId: routeId as Route['route_id'],
      tripId: tripId ? (tripId as Trip['trip_id']) : undefined,
    };
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
    case 'link': {
      const { url } = action;
      if (url.hostname !== window.location.hostname) return state;

      const newState = initStateFromUrl(url);
      newState.freshLoad = false;
      return newState;
    }
    default: {
      const newMain = mainRouterReducer(state.main, action as MainRouterAction);
      const newPoint = pointRouterReducer(
        state.point,
        action as PointRouterAction
      );
      if (newMain !== state.main || newPoint !== state.point) {
        return {
          main: newMain,
          point: newPoint,
          freshLoad: false,
        };
      } else {
        return state;
      }
    }
  }
}
