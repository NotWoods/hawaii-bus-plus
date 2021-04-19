import { RouteDetails } from '../../../worker-info/route-details';
import { TripDetails } from '../../../worker-info/trip-details';

export type RouteDetailAction =
  | ReturnType<typeof setRouteDetailsAction>
  | ReturnType<typeof closeRouteDetailsAction>
  | ReturnType<typeof setTripDetailsAction>
  | ReturnType<typeof setDefaultTripDetailsAction>
  | ReturnType<typeof swapDirectionAction>
  | ReturnType<typeof setDirectionAction>;

export function setRouteDetailsAction(details: RouteDetails) {
  return { type: 'route-details', details } as const;
}

export function closeRouteDetailsAction() {
  return { type: 'close-details' } as const;
}

export function setTripDetailsAction(details: TripDetails) {
  return { type: 'trip-details', details } as const;
}

export function setDefaultTripDetailsAction() {
  return { type: 'trip-details', details: undefined } as const;
}

export function swapDirectionAction() {
  return { type: 'swap-direction' } as const;
}

export function setDirectionAction(id: 0 | 1) {
  return { type: 'direction', id } as const;
}
