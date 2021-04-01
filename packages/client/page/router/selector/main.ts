import { RouterState, ROUTES_PREFIX } from '../state';

export function selectOpenRoute({ main }: Pick<RouterState, 'main'>) {
  if (main?.path === ROUTES_PREFIX) {
    return main;
  } else {
    return undefined;
  }
}
