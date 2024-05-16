import type { Point } from '@hawaii-bus-plus/presentation';
import { Temporal } from '@js-temporal/polyfill';
import { registerWorker } from '../shared/register';
import { directions, type DirectionsResult } from './directions';

export type { Journey, JourneyTripSegment } from './format';
export type { DirectionsResult };

interface DirectionsMessage {
  from: Point;
  to: Point;
  departureTime?: string;
}

export interface DirectionsWorkerHandler {
  (signal: AbortSignal, message: DirectionsMessage): Promise<DirectionsResult>;
}

registerWorker((repo, message: DirectionsMessage) => {
  const departureTime = message.departureTime
    ? Temporal.PlainDateTime.from(message.departureTime)
    : Temporal.Now.plainDateTimeISO();

  return directions(repo, message.from, message.to, departureTime);
});
