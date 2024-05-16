import type { LatLngLiteral } from 'spherical-geometry-js';
import { registerWorker } from '../shared/register';
import { findClosest, type ClosestResults } from './closest/closest';

export type { ClosestResults };

interface ClosestStopsMessage {
  location?: LatLngLiteral;
  fallbackToAll: boolean;
}

export interface NearbyWorkerHandler {
  (signal: AbortSignal, message: ClosestStopsMessage): Promise<ClosestResults>;
}

registerWorker((repo, message: ClosestStopsMessage) => {
  /* Find the closest stops to the given location */
  return findClosest(repo, message.location, message.fallbackToAll);
});
