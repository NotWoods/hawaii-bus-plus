import React, {
  AnchorHTMLAttributes,
  createContext,
  DetailedHTMLProps,
  Dispatch,
  ReactNode,
  useContext,
  useEffect,
  useReducer,
} from 'react';
import { linkAction } from './action';
import {
  initStateFromUrl,
  RouterAction,
  routerReducer,
  RouterState,
} from './reducer';

interface RouterContext extends RouterState {
  dispatch: Dispatch<RouterAction>;
}

export const RouterContext = createContext<RouterContext>({
  dispatch() {},
});

function path(url: URL | Location) {
  return url.pathname + url.search;
}

/**
 * Top level provider for sticky alerts
 */
export function Router(props: { children: ReactNode }) {
  const [state, dispatch] = useReducer(
    routerReducer,
    new URL(window.location.href),
    initStateFromUrl
  );

  useEffect(() => {
    function onPopState() {
      dispatch(linkAction(window.location.href));
    }

    window.addEventListener('popstate', onPopState);

    return () => window.removeEventListener('popstate', onPopState);
  }, []);

  useEffect(() => {
    const url = new URL('/', window.location.href);
    if (state.route_id) {
      url.pathname = `/routes/${state.route_id}/`;
    }
    if (state.stop_id) {
      url.searchParams.set('stop', state.stop_id);
    }
    if (path(url) !== path(window.location)) {
      history.pushState(state, '', path(url));
    }
  }, [state.route_id, state.stop_id]);

  return (
    <RouterContext.Provider value={{ ...state, dispatch }}>
      {props.children}
    </RouterContext.Provider>
  );
}

interface LinkProps
  extends DetailedHTMLProps<
    AnchorHTMLAttributes<HTMLAnchorElement>,
    HTMLAnchorElement
  > {
  action?: RouterAction;
}

/**
 * Element that displays sticky alerts
 */
export function Link({ action, ...props }: LinkProps) {
  const { dispatch } = useContext(RouterContext);
  return (
    <a
      {...props}
      onClick={(evt) => {
        evt.preventDefault();
        props.onClick?.(evt);
        dispatch(action || linkAction(evt.currentTarget.href));
      }}
    />
  );
}
