import { DateString, Route, Stop, TimeString } from '@hawaii-bus-plus/types';
import { Temporal } from 'proposal-temporal';
import { BaseMessageRequest, registerWorker } from '../worker-shared/register';
import { getRouteDetails, RouteDetails } from './route-details';
import { loadStop, StopDetails } from './stop-details';

interface RouteInfoMessage extends BaseMessageRequest {
  type: 'route';
  id: Route['route_id'];
  date?: DateString;
  time?: TimeString;
}

interface StopInfoMessage extends BaseMessageRequest {
  type: 'stop';
  id: Stop['stop_id'];
}

type Message = RouteInfoMessage | StopInfoMessage;

export interface InfoWorkerHandler {
  (signal: AbortSignal, message: RouteInfoMessage): Promise<
    RouteDetails | undefined
  >;
  (signal: AbortSignal, message: StopInfoMessage): Promise<
    StopDetails | undefined
  >;
}

registerWorker((repo, message: Message) => {
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
