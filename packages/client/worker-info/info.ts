import { makeRepository } from '../data/repository';
import { Route, Stop } from '../shared/gtfs-types';
import { registerPromiseWorker } from '../worker-base/register';
import { placeApi, PlaceInfoMessage } from './place-api';
import { getRouteDetails } from './route-details';
import { loadStop } from './stop-details';

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

const repo = makeRepository();

registerPromiseWorker(async (message: Message) => {
  console.log(message);
  switch (message.type) {
    case 'route': {
      return getRouteDetails(
        repo,
        message.id,
        message.time ? new Date(message.time) : new Date()
      );
    }
    case 'stop': {
      return loadStop(repo, message.id);
    }
    case 'place': {
      return placeApi(message);
    }
  }
});
