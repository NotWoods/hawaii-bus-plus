import { makeRepository } from '@hawaii-bus-plus/data';
import { Point } from '@hawaii-bus-plus/presentation';
import { registerPromiseWorker } from '@hawaii-bus-plus/promise-worker/worker';
import { Temporal } from 'proposal-temporal';
import { ClosestResults, findClosest } from './closest/closest';
import { directions, DirectionsResult } from './directions/directions';

export type { DirectionsResult };

interface DirectionsMessage {
  type: 'directions';
  from: Point;
  to: Point;
  departureTime?: string;
}

interface ClosestStopsMessage {
  type: 'closest-stop';
  location?: google.maps.LatLngLiteral;
  fallbackToAll: boolean;
}

type Message = DirectionsMessage | ClosestStopsMessage;

export interface NearbyWorkerHandler {
  (signal: AbortSignal, message: DirectionsMessage): Promise<DirectionsResult>;
  (signal: AbortSignal, message: ClosestStopsMessage): Promise<ClosestResults>;
}

const repo = makeRepository();

registerPromiseWorker(async (message: Message) => {
  switch (message.type) {
    case 'directions': {
      const departureTime = message.departureTime
        ? Temporal.PlainDateTime.from(message.departureTime)
        : Temporal.now.plainDateTimeISO();

      return directions(repo, message.from, message.to, departureTime);
    }
    case 'closest-stop': {
      return findClosest(repo, message.location, message.fallbackToAll);
    }
  }
});
