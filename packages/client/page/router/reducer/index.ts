import { Route, Stop, Trip } from '@hawaii-bus-plus/types';
import { LINK_TYPE, RELOAD_STATE_TYPE, RouterAction } from '../action';
import {
  CLOSE_MAIN_TYPE,
  MainRouterAction,
  OPEN_JOURNEY_TYPE,
  SET_ROUTE_TYPE,
  SET_TRIP_TYPE,
} from '../action/main';
import {
  CLOSE_POINT_TYPE,
  OPEN_PLACE_TYPE,
  PointRouterAction,
  SET_BIKE_STATION_TYPE,
  SET_STOP_TYPE,
} from '../action/point';
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
    case LINK_TYPE: {
      const { url } = action;
      if (url.hostname !== window.location.hostname) return state;

      return injectLoadedData(state, initStateFromUrl(url));
    }
    case RELOAD_STATE_TYPE:
      return action.state;
    case SET_ROUTE_TYPE:
    case SET_TRIP_TYPE:
    case OPEN_JOURNEY_TYPE:
      return {
        main: mainRouterReducer(state.main, action),
        point: state.point,
        freshLoad: false,
        last: 'main',
      };
    case SET_STOP_TYPE:
    case SET_BIKE_STATION_TYPE:
    case OPEN_PLACE_TYPE:
      return {
        main: state.main,
        point: pointRouterReducer(state.point, action),
        freshLoad: false,
        last: 'point',
      };
    case CLOSE_POINT_TYPE:
      return {
        main: state.main,
        point: undefined,
        freshLoad: false,
        last: 'main',
      };
    case CLOSE_MAIN_TYPE:
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
