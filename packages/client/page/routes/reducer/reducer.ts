import { RouteDetailAction } from './action';
import { RouteDetailState } from './state';

function validDirectionIds(directions: readonly unknown[]) {
  const result = new Set<0 | 1>();
  if (directions[0] != undefined) {
    result.add(0);
  }
  if (directions[1] != undefined) {
    result.add(1);
  }
  return result;
}

export function routeDetailReducer(
  state: RouteDetailState,
  action: RouteDetailAction,
): RouteDetailState {
  switch (action.type) {
    case 'route-details': {
      const { details } = action;
      const directionIds = validDirectionIds(details.directions);
      const [firstValidId = 0] = directionIds;

      let selectedTrip = state.selectedTrip;
      if (selectedTrip?.trip?.route_id !== details.route.route_id) {
        selectedTrip = undefined;
      }

      return {
        routeDetails: details,
        selectedTrip,
        directionIds,
        directionId: firstValidId,
      };
    }
    case 'close-details':
      return { directionId: 0, directionIds: new Set() };
    case 'trip-details':
      return { ...state, selectedTrip: action.details };
    case 'swap-direction':
      if (state.directionId === 0) {
        return { ...state, directionId: 1 };
      } else {
        return { ...state, directionId: 0 };
      }
    case 'direction':
      return { ...state, directionId: action.id };
  }
}
