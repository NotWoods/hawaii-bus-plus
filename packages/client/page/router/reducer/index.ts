import { Route, Stop, Trip } from '@hawaii-bus-plus/types';
import { RouterAction } from '../action';
import { MainRouterAction } from '../action/main';
import { PointRouterAction } from '../action/point';
import {
  DIRECTIONS_PATH,
  initialDetails,
  OpenDirectionsState,
  OpenRouteState,
  RouterState,
  ROUTES_PREFIX,
} from '../state';
import { queryToPoint } from '../url';
import { mainRouterReducer } from './main';
import { pointRouterReducer } from './point';

export function initStateFromUrl(url: URL): RouterState {
  const newState: RouterState = { freshLoad: true, last: 'point' };

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
      newState.last = 'main';
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
      details: initialDetails,
    };
    newState.last = 'main';
  }

  // If link opens stop
  const stopId = url.searchParams.get('stop');
  if (stopId) {
    newState.point = { type: 'stop', stopId: stopId as Stop['stop_id'] };
    newState.last = 'point';
  }

  return newState;
}

function injectLoadedData(state: RouterState, newState: RouterState) {
  if (newState.main && newState.main.path === state.main?.path) {
    switch (newState.main.path) {
      case ROUTES_PREFIX: {
        const oldMain = state.main as OpenRouteState;
        if (oldMain.routeId === newState.main.routeId) {
          newState.main.details = oldMain.details;
          if (oldMain.tripId !== newState.main.tripId) {
            newState.main.details.selectedTrip = undefined;
          }
        }
        break;
      }
      case DIRECTIONS_PATH: {
        const oldMain = state.main as OpenDirectionsState;
        newState.main.journey = oldMain.journey;
        break;
      }
    }
  }

  newState.freshLoad = false;
  return newState;
}

export function routerReducer(
  state: RouterState,
  action: RouterAction,
): RouterState {
  switch (action.type) {
    case 'link': {
      const { url } = action;
      if (url.hostname !== window.location.hostname) return state;

      return injectLoadedData(state, initStateFromUrl(url));
    }
    case 'reload-state':
      return action.state;
    case 'route':
    case 'trip':
    case 'open-journey':
      return {
        main: mainRouterReducer(state.main, action),
        point: state.point,
        freshLoad: false,
        last: 'main',
      };
    case 'stop':
    case 'bike-station':
    case 'open-place':
      return {
        main: state.main,
        point: pointRouterReducer(state.point, action),
        freshLoad: false,
        last: 'point',
      };
    case 'close-point':
      return {
        main: state.main,
        point: undefined,
        freshLoad: false,
        last: 'main',
      };
    case 'close-main':
      return {
        main: undefined,
        point: state.point,
        freshLoad: false,
        last: 'point',
      };
    default: {
      const newMain = mainRouterReducer(state.main, action as MainRouterAction);
      const newPoint = pointRouterReducer(
        state.point,
        action as PointRouterAction,
      );
      if (newMain !== state.main || newPoint !== state.point) {
        return {
          main: newMain,
          point: newPoint,
          freshLoad: false,
          last: state.last,
        };
      } else {
        return state;
      }
    }
  }
}
