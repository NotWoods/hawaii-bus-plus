import { useContext } from 'preact/hooks';
import { RouterContext } from './Router';
import { RouterState } from './state';

export function useSelector<Selected>(
  selector: (state: RouterState) => Selected
) {
  const state = useContext(RouterContext);
  return selector(state);
}
