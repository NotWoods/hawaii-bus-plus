import { makeRepository } from '@hawaii-bus-plus/data';
import { registerPromiseWorker } from '@hawaii-bus-plus/promise-worker/worker';
import { DateString, Route, Stop, TimeString } from '@hawaii-bus-plus/types';
import { Temporal } from 'proposal-temporal';
import { getRouteDetails, RouteDetails } from './route-details';
import { loadStop, StopDetails } from './stop-details';

interface RouteInfoMessage {
  type: 'route';
  id: Route['route_id'];
  date?: DateString;
  time?: TimeString;
}

interface StopInfoMessage {
  type: 'stop';
  id: Stop['stop_id'];
}

type Message = RouteInfoMessage | StopInfoMessage;

const repo = makeRepository();

export interface InfoWorkerHandler {
  (signal: AbortSignal, message: RouteInfoMessage): Promise<
    RouteDetails | undefined
  >;
  (signal: AbortSignal, message: StopInfoMessage): Promise<
    StopDetails | undefined
  >;
}

registerPromiseWorker((message: Message) => {
  switch (message.type) {
    case 'route': {
      let date: Temporal.PlainDate | undefined;
      if (message.date) {
        date = Temporal.PlainDate.from(message.date);
      }

      return getRouteDetails(repo, message.id, date, message.time);
    }
    case 'stop': {
      return loadStop(repo, message.id);
    }
  }
});
