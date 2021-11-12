import { DirectionRoute, Stop, Trip } from '@hawaii-bus-plus/types';
import { PlainDaysTime } from '@hawaii-bus-plus/temporal-utils';

export function getStopTime(trip: Trip, stopId: Stop['stop_id']) {
  return trip.stop_times.find((st) => st.stop_id === stopId);
}

export function getEarliestValidTrip(
  route: DirectionRoute,
  stopId: Stop['stop_id'],
  lastRoundTime: PlainDaysTime,
) {
  if (!route.stops.has(stopId)) {
    // this stop isn't even in this route
    return undefined;
  }

  for (const trip of route.trips) {
    const stopTime = getStopTime(trip, stopId)!;
    const departureTime = PlainDaysTime.from(stopTime.departure_time);
    if (PlainDaysTime.compare(lastRoundTime, departureTime) <= 0) {
      return trip;
    }
  }

  return undefined;
}

export function arrivalTime(trip: Trip, stopId: Stop['stop_id']) {
  const time = getStopTime(trip, stopId)?.arrival_time;
  return time && PlainDaysTime.from(time);
}
