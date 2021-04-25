import {
  DIRECTIONS_PATH,
  initialDetails,
  OpenRouteState,
  RouterState,
  ROUTES_PREFIX,
} from '../state';
import { directionsToParams } from '../url';

export function selectOpenRoute({
  main,
}: Pick<RouterState, 'main'>): Partial<OpenRouteState> {
  if (main?.path === ROUTES_PREFIX) {
    return main;
  } else {
    return {};
  }
}

export function selectJourney({ main }: Pick<RouterState, 'main'>) {
  if (main?.path === DIRECTIONS_PATH) {
    return main.journey;
  } else {
    return undefined;
  }
}

export function selectUrl(
  { main }: Pick<RouterState, 'main'>,
  base = window.location.href,
) {
  const url = new URL('/', base);
  if (main) {
    if (main.path === ROUTES_PREFIX) {
      const { routeId, tripId = '' } = main;
      url.pathname = `${ROUTES_PREFIX}${routeId}/${tripId}`;
    } else if (main.path === DIRECTIONS_PATH) {
      url.pathname = DIRECTIONS_PATH;
      directionsToParams(main, url.searchParams);
    } else {
      // url.pathname = state.main.path;
    }
  }
  return url;
}

export function selectLoadedDetails({ main }: Pick<RouterState, 'main'>) {
  if (main?.path === ROUTES_PREFIX) {
    return main.details;
  } else {
    return initialDetails;
  }
}

export function selectRouteDetails(state: Pick<RouterState, 'main'>) {
  return selectLoadedDetails(state).routeDetails;
}

export function selectHasMultipleDirections(state: Pick<RouterState, 'main'>) {
  return selectLoadedDetails(state).directionIds.size >= 2;
}
