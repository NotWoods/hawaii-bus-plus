import { dbReady } from '../data/database';
import { removeWords } from '../data/format';
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
      const db = await dbReady;
      return getRouteDetails(
        db,
        message.id,
        message.time ? new Date(message.time) : new Date()
      );
    }
    case 'stop': {
      const db = await dbReady;
      const stop = await db.get('stops', message.id);
      return stop && removeWords(stop);
    }
    case 'place': {
      return placeApi(message);
    }
  }
});
