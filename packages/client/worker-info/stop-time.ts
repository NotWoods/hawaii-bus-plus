import {
  PlainTimeData,
  plainTimeToData,
  StopTimeData,
} from '@hawaii-bus-plus/presentation';
import { PlainDaysTime } from '@hawaii-bus-plus/temporal-utils';
import { Route, Stop, StopTime, TimeString } from '@hawaii-bus-plus/types';
import { notNull } from '@hawaii-bus-plus/utils';
import { Temporal } from 'proposal-temporal';

export interface ZonedTimeOptions {
  serviceDate: Temporal.PlainDate;
  timeZone: string | Temporal.TimeZoneProtocol;
}

export function zonedTime(
  time: TimeString | PlainDaysTime,
  options: ZonedTimeOptions,
): PlainTimeData {
  return plainTimeToData(
    PlainDaysTime.from(time),
    options.serviceDate,
    options.timeZone,
  );
}

export interface FormatOptions extends ZonedTimeOptions {
  stops: ReadonlyMap<Stop['stop_id'], Stop>;
  routeId?: Route['route_id'];
  routes: ReadonlyMap<Route['route_id'], Route>;
}

export function formatStopTime(
  stopTime: StopTime,
  options: FormatOptions,
): StopTimeData {
  const stop = options.stops.get(stopTime.stop_id)!;
  return {
    stop,
    routes: stop.routes
      .filter((id) => id !== options.routeId)
      .map((routeId) => options.routes.get(routeId))
      .filter(notNull),
    arrivalTime: zonedTime(stopTime.arrival_time, options),
    departureTime: zonedTime(stopTime.departure_time, options),
    timepoint: stopTime.timepoint,
  };
}
