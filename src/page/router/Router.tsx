import React, {
  AnchorHTMLAttributes,
  createContext,
  DetailedHTMLProps,
  Dispatch,
  ReactNode,
  useContext,
  useReducer,
} from 'react';
import { linkAction } from './action';
import { RouterAction, routerReducer, RouterState } from './reducer';

interface RouterContext extends RouterState {
  dispatch: Dispatch<RouterAction>;
}

export const RouterContext = createContext<RouterContext>({ dispatch() {} });

/**
 * Top level provider for sticky alerts
 */
export function Router(props: { children: ReactNode }) {
  const [state, dispatch] = useReducer(routerReducer, {});

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
