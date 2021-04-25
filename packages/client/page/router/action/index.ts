import { RouterState } from '../state';
import { MainRouterAction } from './main';
import { PointRouterAction } from './point';

export type RouterAction =
  | ReturnType<typeof linkAction>
  | ReturnType<typeof reloadStateAction>
  | MainRouterAction
  | PointRouterAction;

export function linkAction(href: string | URL) {
  const url = typeof href === 'string' ? new URL(href) : href;
  return { type: 'link', url } as const;
}

export function reloadStateAction(state: RouterState) {
  return { type: 'reload-state', state } as const;
}
