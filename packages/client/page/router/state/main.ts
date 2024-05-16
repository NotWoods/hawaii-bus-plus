import type { PlacePointPartial, Point } from '@hawaii-bus-plus/presentation';
import type { Route, Trip } from '@hawaii-bus-plus/types';
import type { RouteDetails, TripDetails } from '@hawaii-bus-plus/workers/info';
import type { Journey } from '@hawaii-bus-plus/workers/directions';

export const ROUTES_PREFIX = '/routes/';
export const DIRECTIONS_PATH = '/directions';

export interface RouteDetailState {
  routeDetails?: RouteDetails;
  selectedTrip?: TripDetails;
  directionId: 0 | 1;
  directionIds: ReadonlySet<0 | 1>;
}

export interface OpenRouteState {
  path: typeof ROUTES_PREFIX;
  routeId: Route['route_id'];
  tripId?: Trip['trip_id'];
  details: RouteDetailState;
}

export interface OpenDirectionsState {
  path: typeof DIRECTIONS_PATH;
  depart: Point | PlacePointPartial;
  arrive: Point | PlacePointPartial;
  departureTime: string;
  journey?: Journey;
}

export type MainState = OpenRouteState | OpenDirectionsState;

export const initialDetails: RouteDetailState = {
  directionId: 0,
  directionIds: new Set(),
};
