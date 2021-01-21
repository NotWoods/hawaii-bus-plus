import { Temporal } from 'proposal-temporal';
import { makeRepository } from '../data/repository';
import { registerPromiseWorker } from '../worker-base/register';
import { findClosestStops } from './closest-stops';
import { directions, Point } from './directions';

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

const repo = makeRepository();

registerPromiseWorker(async (message: Message) => {
  switch (message.type) {
    case 'directions': {
      const departureTime = message.departureTime
        ? Temporal.PlainDateTime.from(message.departureTime)
        : Temporal.now.plainDateTimeISO();

      const result = await directions(
        repo,
        message.from,
        message.to,
        departureTime
      );
      console.log(result);
      return result;
    }
    case 'closest-stop': {
      return findClosestStops(repo, message.location);
    }
  }
});
