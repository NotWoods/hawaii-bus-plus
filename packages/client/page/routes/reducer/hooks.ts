import { useContext } from 'preact/hooks';
import { RouteDetailContext } from './context';
import { RouteDetailState } from './state';

export function useRouteDetailSelector<Selected>(
  selector: (state: RouteDetailState) => Selected,
) {
  const state = useContext(RouteDetailContext);
  return selector(state);
}

export function useRouteDetailDispatch() {
  const { dispatch } = useContext(RouteDetailContext);
  return dispatch;
}
