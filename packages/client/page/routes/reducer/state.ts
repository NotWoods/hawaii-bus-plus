import type { RouteDetails } from '../../../worker-info/route-details';
import type { TripDetails } from '../../../worker-info/trip-details';

export interface RouteDetailState {
  routeDetails?: RouteDetails;
  selectedTrip?: TripDetails;
  directionId: 0 | 1;
  directionIds: ReadonlySet<0 | 1>;
}

export const initialState: RouteDetailState = {
  directionId: 0,
  directionIds: new Set(),
};
