import { useContext } from 'preact/hooks';
import { RouterContext } from './Router';
import type { RouterState } from './state';

export function useSelector<Selected>(
  selector: (state: RouterState) => Selected,
) {
  const state = useContext(RouterContext);
  return selector(state);
}

export function useDispatch() {
  const { dispatch } = useContext(RouterContext);
  return dispatch;
}
