import { RouterState } from '../state';
import { MainRouterAction } from './main';
import { PointRouterAction } from './point';

export type RouterAction =
  | ReturnType<typeof linkAction>
  | ReturnType<typeof reloadStateAction>
  | MainRouterAction
  | PointRouterAction;

export const LINK_TYPE = Symbol('link');
export const RELOAD_STATE_TYPE = Symbol('reload-state');

export function linkAction(href: string | URL) {
  const url = typeof href === 'string' ? new URL(href) : href;
  return { type: LINK_TYPE, url } as const;
}

export function reloadStateAction(state: RouterState) {
  return { type: RELOAD_STATE_TYPE, state } as const;
}
