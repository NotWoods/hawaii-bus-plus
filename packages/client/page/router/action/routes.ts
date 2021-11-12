import type { RouteDetails, TripDetails } from '../../../workers/info';

export type OpenRouteAction =
  | ReturnType<typeof setRouteDetailsAction>
  | ReturnType<typeof closeRouteDetailsAction>
  | ReturnType<typeof setTripDetailsAction>
  | ReturnType<typeof setDefaultTripDetailsAction>
  | ReturnType<typeof swapDirectionAction>
  | ReturnType<typeof setDirectionAction>
  | ReturnType<typeof resetTripAction>;

export const ROUTE_DETAILS_TYPE = Symbol('route-details');
export const CLOSE_ROUTE_DETAILS_TYPE = Symbol('close-details');
export const TRIP_DETAILS_TYPE = Symbol('trip-details');
export const RESET_TRIP_DETAILS_TYPE = Symbol('close-trip');
export const SWAP_DIRECTION_TYPE = Symbol('swap-direction');
export const SET_DIRECTION_TYPE = Symbol('direction');

export function setRouteDetailsAction(details: RouteDetails) {
  return { type: ROUTE_DETAILS_TYPE, details } as const;
}

export function closeRouteDetailsAction() {
  return { type: CLOSE_ROUTE_DETAILS_TYPE } as const;
}

export function setTripDetailsAction(details: TripDetails) {
  return { type: TRIP_DETAILS_TYPE, details } as const;
}

export function setDefaultTripDetailsAction() {
  return { type: TRIP_DETAILS_TYPE, details: undefined } as const;
}

export function swapDirectionAction() {
  return { type: SWAP_DIRECTION_TYPE } as const;
}

export function setDirectionAction(id: 0 | 1) {
  return { type: SET_DIRECTION_TYPE, id } as const;
}

export function resetTripAction() {
  return { type: RESET_TRIP_DETAILS_TYPE } as const;
}
