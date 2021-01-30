import { makeRepository } from '@hawaii-bus-plus/data';
import { Point } from '@hawaii-bus-plus/presentation';
import { registerPromiseWorker } from '@hawaii-bus-plus/promise-worker/worker';
import { Temporal } from 'proposal-temporal';
import { findClosestStops, StopWithDistance } from './closest-stops';
import { directions } from './directions';
import { Journey } from './directions/format';

interface DirectionsMessage {
  type: 'directions';
  from: Point;
  to: Point;
  departureTime?: string | Temporal.PlainDateTime;
}

interface ClosestStopsMessage {
  type: 'closest-stop';
  location: google.maps.LatLngLiteral;
}

type Message = DirectionsMessage | ClosestStopsMessage;

export interface NearbyWorkerHandler {
  (message: DirectionsMessage): Promise<Journey[]>;
  (message: ClosestStopsMessage): Promise<StopWithDistance[]>;
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
      return findClosestStops(repo, message.location);
    }
  }
});
