import { DateString, Route, Stop, Trip } from '@hawaii-bus-plus/types';
import { Temporal } from '@js-temporal/polyfill';
import { BaseMessageRequest, registerWorker } from '../shared/register';
import { getRouteDetails, RouteDetails } from './route-details';
import { loadStop, StopDetails } from './stop-details';
import { getTripDetails, TripDetails } from './trip-details';

interface RouteInfoMessage extends BaseMessageRequest {
  type: 'route';
  routeId: Route['route_id'];
  date?: DateString;
}

interface TripInfoMessage extends BaseMessageRequest {
  type: 'trip';
  routeId: Route['route_id'];
  tripId: Trip['trip_id'];
  date?: DateString;
}

interface StopInfoMessage extends BaseMessageRequest {
  type: 'stop';
  id: Stop['stop_id'];
}

type Message = RouteInfoMessage | TripInfoMessage | StopInfoMessage;

export interface InfoWorkerHandler {
  (signal: AbortSignal, message: RouteInfoMessage): Promise<
    RouteDetails | undefined
  >;
  (signal: AbortSignal, message: TripInfoMessage): Promise<
    TripDetails | undefined
  >;
  (signal: AbortSignal, message: StopInfoMessage): Promise<
    StopDetails | undefined
  >;
}

function extractDate(message: {
  date?: DateString;
}): Temporal.PlainDate | undefined {
  if (message.date) {
    return Temporal.PlainDate.from(message.date);
  } else {
    return undefined;
  }
}

registerWorker((repo, message: Message) => {
  switch (message.type) {
    case 'route':
      return getRouteDetails(repo, message.routeId, extractDate(message));
    case 'trip':
      return getTripDetails(
        repo,
        message.routeId,
        message.tripId,
        extractDate(message),
      );
    case 'stop':
      return loadStop(repo, message.id);
  }
});
