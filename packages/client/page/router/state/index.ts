import { Point } from '@hawaii-bus-plus/presentation';
import { MainState } from './main';

export * from './main';

export interface RouterState {
  main?: MainState;

  point?: Point;

  freshLoad: boolean;
}

export const initialState: RouterState = { freshLoad: false };
