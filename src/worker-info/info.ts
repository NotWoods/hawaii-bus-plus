import { dbReady, SearchStop } from '../data/database';
import { Route, Stop } from '../shared/gtfs-types';
import { registerPromiseWorker } from '../worker-base/register';
import { placeApi, PlaceInfoMessage } from './place-api';
import { getRouteDetails } from './route-details';

interface RouteInfoMessage {
  type: 'route';
  id: Route['route_id'];
  time?: number;
}

interface StopInfoMessage {
  type: 'stop';
  id: Stop['stop_id'];
}

type Message = RouteInfoMessage | StopInfoMessage | PlaceInfoMessage;

registerPromiseWorker(async (message: Message) => {
  console.log(message);
  switch (message.type) {
    case 'route': {
      return getRouteDetails(
        message.id,
        message.time ? new Date(message.time) : new Date()
      );
    }
    case 'stop': {
      const db = await dbReady;
      const stop: (Stop & Partial<SearchStop>) | undefined = await db.get(
        'stops',
        message.id
      );
      delete stop?.words;
      return stop;
    }
    case 'place': {
      return placeApi(message);
    }
  }
});
