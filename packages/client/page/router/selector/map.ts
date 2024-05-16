import { DIRECTIONS_PATH, ROUTES_PREFIX, type RouterState } from '../state';

/**
 * Select bounding box for the map
 */
export function selectBounds({ main }: Pick<RouterState, 'main'>) {
  switch (main?.path) {
    case ROUTES_PREFIX:
      return main.details.routeDetails?.bounds;
    case DIRECTIONS_PATH:
      return main.journey?.bounds;
    default:
      return undefined;
  }
}
