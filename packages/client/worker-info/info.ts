import { makeRepository } from '@hawaii-bus-plus/data';
import { registerPromiseWorker } from '@hawaii-bus-plus/promise-worker/worker';
import { Route, Stop } from '@hawaii-bus-plus/types';
import { Temporal } from 'proposal-temporal';
import { placeApi, PlaceInfoMessage } from './place-api';
import { getRouteDetails } from './route-details';
import { loadStop } from './stop-details';

interface RouteInfoMessage {
  type: 'route';
  id: Route['route_id'];
  time?: string;
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
      let time: Temporal.PlainDateTime | undefined;
      if (message.time) {
        time = Temporal.PlainDateTime.from(message.time);
      }

      return getRouteDetails(repo, message.id, time);
    }
    case 'stop': {
      return loadStop(repo, message.id);
    }
    case 'place': {
      return placeApi(message);
    }
  }
});
