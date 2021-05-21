import { Point } from '@hawaii-bus-plus/presentation';
import { Temporal } from 'proposal-temporal';
import { BaseMessageRequest, registerWorker } from '../worker-shared/register';
import { directions, DirectionsResult } from './directions';

export type { DirectionsResult };
export type { Journey, JourneyTripSegment } from './format';

interface DirectionsMessage extends BaseMessageRequest {
  type: 'directions';
  from: Point;
  to: Point;
  departureTime?: string;
}

type Message = DirectionsMessage;

export interface DirectionsWorkerHandler {
  (signal: AbortSignal, message: DirectionsMessage): Promise<DirectionsResult>;
}

registerWorker((repo, message: Message) => {
  switch (message.type) {
    case 'directions': {
      const departureTime = message.departureTime
        ? Temporal.PlainDateTime.from(message.departureTime)
        : Temporal.now.plainDateTimeISO();

      return directions(repo, message.from, message.to, departureTime);
    }
  }
});
