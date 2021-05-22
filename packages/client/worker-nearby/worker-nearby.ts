import { registerWorker } from '../worker-shared/register';
import { ClosestResults, findClosest } from './closest/closest';

export type { ClosestResults };

interface ClosestStopsMessage {
  location?: google.maps.LatLngLiteral;
  fallbackToAll: boolean;
}

export interface NearbyWorkerHandler {
  (signal: AbortSignal, message: ClosestStopsMessage): Promise<ClosestResults>;
}

registerWorker((repo, message: ClosestStopsMessage) => {
  /* Find the closest stops to the given location */
  return findClosest(repo, message.location, message.fallbackToAll);
});
