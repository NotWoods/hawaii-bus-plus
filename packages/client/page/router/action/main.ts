import { Point } from '@hawaii-bus-plus/presentation';
import { Route } from '@hawaii-bus-plus/types';
import type { Journey } from '../../../worker-nearby/directions/format';

export type MainRouterAction =
  | ReturnType<typeof setRouteAction>
  | ReturnType<typeof closeMainAction>
  | ReturnType<typeof openJourney>;

export function setRouteAction(
  routeId: Route['route_id']
): { type: 'route'; routeId: Route['route_id'] } {
  return { type: 'route', routeId };
}

export function closeMainAction() {
  return { type: 'close-main' } as const;
}

export function openJourney(
  depart: Point,
  arrive: Point,
  departureTime: string,
  journey: Journey
) {
  return {
    type: 'open-journey',
    depart,
    arrive,
    departureTime,
    journey,
  } as const;
}
