import { ComponentChildren, createContext, h } from 'preact';
import { Reducer, useEffect, useMemo, useReducer } from 'preact/hooks';
import { JSXInternal } from 'preact/src/jsx';
import { useFocusTrapped } from '../buttons/FocusTrap';
import { linkAction, reloadStateAction, RouterAction } from './action';
import { useDispatch } from './hooks';
import { initStateFromUrl, routerReducer } from './reducer';
import { selectUrl } from './selector/main';
import { initialState, RouterState } from './state';

interface RouterContext extends RouterState {
  dispatch(action: RouterAction): void;
}

export const RouterContext = createContext<RouterContext>({
  ...initialState,
  dispatch() {},
});

function path(url: URL | Location) {
  return url.pathname + url.search;
}

function debugReducer<State, Action>(reducer: Reducer<State, Action>) {
  if (import.meta.env.DEV) {
    return (state: State, action: Action) => {
      const newState = reducer(state, action);
      console.log(action, state);
      return newState;
    };
  } else {
    return reducer;
  }
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
    debugReducer(routerReducer),
    initialUrl,
    initStateFromUrl,
  );
  const value = useMemo(
    () => Object.assign({}, state, { dispatch }),
    [state, dispatch],
  );

  useEffect(() => {
    function onPopState(evt: PopStateEvent) {
      if (evt.state) {
        dispatch(reloadStateAction(evt.state));
      } else {
        dispatch(linkAction(window.location.href));
      }
    }

    window.addEventListener('popstate', onPopState);

    return () => window.removeEventListener('popstate', onPopState);
  }, []);

  useEffect(() => {
    const url = selectUrl(state);

    if (state.point?.type === 'stop') {
      url.searchParams.set('stop', state.point.stopId);
    }

    const fullPath = path(url);
    if (fullPath !== path(window.location)) {
      history.pushState(state, '', fullPath);
    } else {
      history.replaceState(state, '', fullPath);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state.main, state.point]);

  return (
    <RouterContext.Provider value={value}>
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
  const dispatch = useDispatch();
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
