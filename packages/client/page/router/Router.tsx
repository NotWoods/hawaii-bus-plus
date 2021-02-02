import { h, createContext, ComponentChildren } from 'preact';
import { useContext, useEffect, useReducer } from 'preact/hooks';
import { JSXInternal } from 'preact/src/jsx';
import { linkAction, RouterAction } from './action';
import { initStateFromUrl, routerReducer, RouterState } from './reducer';

interface RouterContext extends RouterState {
  dispatch(action: RouterAction): void;
}

export const RouterContext = createContext<RouterContext>({
  directionsOpen: false,
  freshLoad: false,
  dispatch() {},
});

function path(url: URL | Location) {
  return url.pathname + url.search;
}

/**
 * Top level provider for sticky alerts
 */
export function Router(props: { children: ComponentChildren }) {
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
    if (state.directionsOpen) {
      url.pathname = '/directions/';
    } else if (state.routeId) {
      url.pathname = `/routes/${state.routeId}/`;
    }
    if (state.point?.type === 'stop') {
      url.searchParams.set('stop', state.point.stopId);
    }
    if (path(url) !== path(window.location)) {
      history.pushState(state, '', path(url));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state.routeId, state.point, state.directionsOpen]);

  return (
    <RouterContext.Provider value={{ ...state, dispatch }}>
      {props.children}
    </RouterContext.Provider>
  );
}

interface LinkProps
  extends Omit<JSXInternal.HTMLAttributes<HTMLAnchorElement>, 'action'> {
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
      onClick={function (evt) {
        evt.preventDefault();
        props.onClick?.call(this, evt);
        dispatch(action ?? linkAction(evt.currentTarget.href));
      }}
    />
  );
}
