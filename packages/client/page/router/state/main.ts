import { PlacePointPartial, Point } from '@hawaii-bus-plus/presentation';
import { Route } from '@hawaii-bus-plus/types';
import type { Journey } from '../../../worker-nearby/directions/format';

export const ROUTES_PREFIX = '/routes/';
export const DIRECTIONS_PATH = '/directions';

export interface OpenRouteState {
  path: typeof ROUTES_PREFIX;
  routeId: Route['route_id'];
}

export interface OpenDirectionsState {
  path: typeof DIRECTIONS_PATH;
  depart: Point | PlacePointPartial;
  arrive: Point | PlacePointPartial;
  departureTime: string;
  journey?: Journey;
}

export type MainState = OpenRouteState | OpenDirectionsState;
