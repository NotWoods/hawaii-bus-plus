import type { Point } from '@hawaii-bus-plus/presentation';
import type { Route, Trip } from '@hawaii-bus-plus/types';
import type { Journey } from '@hawaii-bus-plus/workers/directions';
import type { OpenRouteAction } from './routes';

export type MainRouterAction =
  | ReturnType<typeof setRouteAction>
  | ReturnType<typeof setTripAction>
  | ReturnType<typeof closeMainAction>
  | ReturnType<typeof openJourney>
  | OpenRouteAction;

export const SET_ROUTE_TYPE = Symbol('route');
export const SET_TRIP_TYPE = Symbol('trip');
export const CLOSE_MAIN_TYPE = Symbol('close-main');
export const OPEN_JOURNEY_TYPE = Symbol('journey');

export function setRouteAction(routeId: Route['route_id']) {
  return { type: SET_ROUTE_TYPE, routeId } as const;
}

export function setTripAction(
  routeId: Route['route_id'],
  tripId: Trip['trip_id'],
) {
  return { type: SET_TRIP_TYPE, routeId, tripId } as const;
}

export function closeMainAction() {
  return { type: CLOSE_MAIN_TYPE } as const;
}

export function openJourney(
  depart: Point,
  arrive: Point,
  departureTime: string,
  journey: Journey,
) {
  return {
    type: OPEN_JOURNEY_TYPE,
    depart,
    arrive,
    departureTime,
    journey,
  } as const;
}
