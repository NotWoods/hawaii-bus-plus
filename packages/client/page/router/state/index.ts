import type { Point } from '@hawaii-bus-plus/presentation';
import type { MainState } from './main';

export * from './main';

export interface RouterState {
  main?: MainState;

  point?: Point;

  freshLoad: boolean;
  last: 'main' | 'point';
}

export const initialState: RouterState = { freshLoad: false, last: 'point' };
