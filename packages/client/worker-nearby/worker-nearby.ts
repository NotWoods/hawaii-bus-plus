import { BaseMessageRequest, registerWorker } from '../worker-shared/register';
import { ClosestResults, findClosest } from './closest/closest';

export type { ClosestResults };

interface ClosestStopsMessage extends BaseMessageRequest {
  type: 'closest-stop';
  location?: google.maps.LatLngLiteral;
  fallbackToAll: boolean;
}

type Message = ClosestStopsMessage;

export interface NearbyWorkerHandler {
  (signal: AbortSignal, message: ClosestStopsMessage): Promise<ClosestResults>;
}

registerWorker((repo, message: Message) => {
  switch (message.type) {
    /* Find the closest stops to the given location */
    case 'closest-stop': {
      return findClosest(repo, message.location, message.fallbackToAll);
    }
  }
});
