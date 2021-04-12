import { ComponentChildren, createContext, h } from 'preact';
import { useContext, useEffect, useReducer } from 'preact/hooks';
import { JSXInternal } from 'preact/src/jsx';
import { useFocusTrapped } from '../buttons/FocusTrap';
import { linkAction, RouterAction } from './action';
import { initStateFromUrl, routerReducer } from './reducer';
import { selectUrl } from './selector/main';
import { RouterState } from './state';

interface RouterContext extends RouterState {
  dispatch(action: RouterAction): void;
}

export const RouterContext = createContext<RouterContext>({
  freshLoad: false,
  dispatch() {},
});

function path(url: URL | Location) {
  return url.pathname + url.search;
}

/**
 * Top level provider for sticky alerts
 */
export function Router(props: {
  initialUrl?: URL;
  children: ComponentChildren;
}) {
  const { initialUrl = new URL(window.location.href) } = props;
  const [state, dispatch] = useReducer(
    routerReducer,
    initialUrl,
    initStateFromUrl,
  );

  useEffect(() => {
    function onPopState() {
      dispatch(linkAction(window.location.href));
    }

    window.addEventListener('popstate', onPopState);

    return () => window.removeEventListener('popstate', onPopState);
  }, []);

  useEffect(() => {
    const url = selectUrl(state);

    if (state.point?.type === 'stop') {
      url.searchParams.set('stop', state.point.stopId);
    }

    if (path(url) !== path(window.location)) {
      history.pushState(state, '', path(url));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state.main, state.point]);

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
export function Link({ action, tabIndex, ...props }: LinkProps) {
  const { dispatch } = useContext(RouterContext);
  const trapped = useFocusTrapped(tabIndex);
  return (
    <a
      {...props}
      tabIndex={trapped ? -1 : 0}
      onClick={function (evt) {
        evt.preventDefault();
        props.onClick?.call(this, evt);
        dispatch(action ?? linkAction(evt.currentTarget.href));
      }}
    />
  );
}
