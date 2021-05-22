import {
  CLOSE_ROUTE_DETAILS_TYPE,
  OpenRouteAction,
  RESET_TRIP_DETAILS_TYPE,
  ROUTE_DETAILS_TYPE,
  SET_DIRECTION_TYPE,
  SWAP_DIRECTION_TYPE,
  TRIP_DETAILS_TYPE,
} from '../action/routes';
import {
  initialDetails,
  OpenRouteState,
  RouteDetailState,
} from '../state/main';

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

function setDetails(
  state: OpenRouteState,
  newDetails: Partial<RouteDetailState>,
): OpenRouteState {
  const newState = Object.assign({}, state);
  newState.details = Object.assign({}, state.details, newDetails);
  return newState;
}

export function openRouteReducer(
  state: OpenRouteState,
  action: OpenRouteAction,
): OpenRouteState {
  const { details } = state;
  switch (action.type) {
    case ROUTE_DETAILS_TYPE: {
      const newDetails = action.details;
      const directionIds = validDirectionIds(newDetails.directions);
      const [firstValidId = 0] = directionIds;

      let selectedTrip = details.selectedTrip;
      if (selectedTrip?.trip?.route_id !== newDetails.route.route_id) {
        selectedTrip = undefined;
      }

      return Object.assign({}, state, {
        details: {
          routeDetails: newDetails,
          selectedTrip,
          directionIds,
          directionId: firstValidId,
        },
      });
    }
    case CLOSE_ROUTE_DETAILS_TYPE:
      return Object.assign({}, state, { details: initialDetails });
    case TRIP_DETAILS_TYPE:
      return setDetails(state, { selectedTrip: action.details });
    case SWAP_DIRECTION_TYPE: {
      const directionId: 0 | 1 = details.directionId === 0 ? 1 : 0;
      return setDetails(state, { directionId });
    }
    case SET_DIRECTION_TYPE:
      return setDetails(state, { directionId: action.id });
    case RESET_TRIP_DETAILS_TYPE: {
      const newState = setDetails(state, { selectedTrip: undefined });
      newState.tripId = undefined;
      return newState;
    }
    default:
      return state;
  }
}
