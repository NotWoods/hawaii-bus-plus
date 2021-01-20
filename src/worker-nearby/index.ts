import { Temporal } from 'proposal-temporal';
import { Stop } from '../shared/gtfs-types';
import { registerPromiseWorker } from '../worker-base/register';
import { findClosestStops } from './closest-stops';
import { raptorDirections } from './directions';

interface DirectionsMessage {
  type: 'directions';
  source: Stop['stop_id'];
  departureTime: string;
}

interface ClosestStopsMessage {
  type: 'closest-stop';
  location: google.maps.LatLngLiteral;
}

type Message = DirectionsMessage | ClosestStopsMessage;

registerPromiseWorker(async (message: Message) => {
  console.log(message);
  switch (message.type) {
    case 'directions': {
      const result = await raptorDirections(
        message.source,
        Temporal.PlainDateTime.from(message.departureTime)
      );
      console.log(result);
      return result;
    }
    case 'closest-stop': {
      return findClosestStops(message.location);
    }
  }
});
