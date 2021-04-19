import { ComponentChildren, createContext, h } from 'preact';
import { useReducer } from 'preact/hooks';
import { RouteDetailAction } from './action';
import { routeDetailReducer } from './reducer';
import { initialState, RouteDetailState } from './state';

interface RouteDetailContext extends RouteDetailState {
  dispatch(action: RouteDetailAction): void;
}

export const RouteDetailContext = createContext<RouteDetailContext>({
  ...initialState,
  dispatch() {},
});

export function RouteDetailProvider(props: { children: ComponentChildren }) {
  const [state, dispatch] = useReducer(routeDetailReducer, initialState);

  return (
    <RouteDetailContext.Provider value={{ ...state, dispatch }}>
      {props.children}
    </RouteDetailContext.Provider>
  );
}
