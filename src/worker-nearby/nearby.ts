import { Temporal } from 'proposal-temporal';
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

console.log('hello world');

registerPromiseWorker(async (message: Message) => {
  console.log(message);
  switch (message.type) {
    case 'directions': {
      const departureTime = message.departureTime
        ? Temporal.PlainDateTime.from(message.departureTime)
        : Temporal.now.plainDateTimeISO();
      console.log(departureTime);
      const result = await directions(message.from, message.to, departureTime);
      console.log(result);
      return result;
    }
    case 'closest-stop': {
      return findClosestStops(message.location);
    }
  }
});
