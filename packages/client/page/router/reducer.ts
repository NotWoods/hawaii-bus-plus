import {
  closeRouteAction,
  closeStopAction,
  linkAction,
  openPlace,
  setMarker,
  setRouteAction,
  setStopAction,
  updateUserLocation,
} from './action';

export interface PlaceResult
  extends Pick<
    google.maps.places.PlaceResult,
    'formatted_address' | 'place_id'
  > {
  name?: string;
  location?: google.maps.LatLngLiteral;
}

export interface RouterState {
  route_id?: string;

  focus?: 'stop' | 'place' | 'user' | 'marker';
  stop_id?: string;

  place_id?: string;
  place?: PlaceResult;
  user?: google.maps.LatLngLiteral;
  marker?: google.maps.LatLngLiteral;

  directionsOpen?: boolean;
}

export type RouterAction =
  | ReturnType<typeof linkAction>
  | ReturnType<typeof setRouteAction>
  | ReturnType<typeof setStopAction>
  | ReturnType<typeof closeRouteAction>
  | ReturnType<typeof closeStopAction>
  | ReturnType<typeof setMarker>
  | ReturnType<typeof openPlace>
  | ReturnType<typeof updateUserLocation>;

const ROUTES_PREFIX = '/routes/';
const DIRECTIONS = '/directions/';

export function initStateFromUrl(url: URL) {
  const newState: RouterState = {};

  if (url.pathname.startsWith(DIRECTIONS)) {
    newState.directionsOpen = true;
  } else if (url.pathname.startsWith(ROUTES_PREFIX)) {
    // If link opens route
    const [routeId] = url.pathname.slice(ROUTES_PREFIX.length).split('/');
    newState.route_id = routeId;
  }

  // If link opens stop
  newState.stop_id = url.searchParams.get('stop') || undefined;
  console.log(newState);
  return newState;
}

export function routerReducer(
  state: RouterState,
  action: RouterAction
): RouterState {
  switch (action.type) {
    case 'route':
      return {
        ...state,
        route_id: action.routeId,
      };
    case 'stop':
      return {
        ...state,
        focus: 'stop',
        stop_id: action.stopId,
      };
    case 'close-route':
      return {
        ...state,
        route_id: undefined,
      };
    case 'close-stop':
      switch (state.focus) {
        case 'stop':
          return {
            ...state,
            focus: undefined,
            stop_id: undefined,
          };
        case 'place':
          return {
            ...state,
            focus: undefined,
            place_id: undefined,
            place: undefined,
          };
        case 'user':
          return {
            ...state,
            focus: undefined,
            user: undefined,
          };
        case 'marker':
          return {
            ...state,
            focus: undefined,
            marker: undefined,
          };
        default:
          return state;
      }
    case 'set-marker':
      return {
        ...state,
        focus: 'marker',
        place_id: undefined,
        place: undefined,
        marker: action.location,
      };
    case 'open-place':
      return {
        ...state,
        focus: 'place',
        place_id: action.place.place_id,
        place: action.place,
        marker: undefined,
      };
    case 'update-user-location':
      return {
        ...state,
        focus: action.silent ? state.focus : 'user',
        user: action.location,
      };
    case 'link':
      const { url } = action;
      if (url.hostname !== window.location.hostname) return state;

      return initStateFromUrl(url);
    default:
      throw new Error(`Invalid action`);
  }
}
