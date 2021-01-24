import { Repository } from '@hawaii-bus-plus/data';
import { Route, Stop, Trip } from '@hawaii-bus-plus/types';
import { nestedNotNull, PlainDaysTime } from '@hawaii-bus-plus/utils';
import { Temporal } from 'proposal-temporal';
import { findClosestStops } from './closest-stops';
import { Path, raptorDirections, Source } from './directions/raptor';

/**
 * Starting or ending point for directions.
 * Includes some styling information for presentation in
 * text box & direction results.
 */
export interface Point {
  type: 'user' | 'stop' | 'place' | 'marker';
  stop_id?: Stop['stop_id'];
  name: string;
  position: google.maps.LatLngLiteral;
}

export interface Walking {
  time: { minutes: number };
  distance: number;
}

async function pointToSources(
  repo: Pick<Repository, 'loadStopsSpatial'>,
  point: Point,
  departureTime: Temporal.PlainDateTime
): Promise<Source[]> {
  const time = new PlainDaysTime(0, departureTime.toPlainTime());
  if (point.stop_id) {
    return [
      {
        stop_id: point.stop_id,
        departure_time: time,
      },
    ];
  } else {
    const closest = await findClosestStops(repo, point.position);
    return closest.map((stop) => {
      // Rough walking speed is 1 meter per second
      const timeWithWalking = time.add({ seconds: stop.distance });
      return {
        stop_id: stop.stop_id,
        departure_time: timeWithWalking,
      };
    });
  }
}

function traversePathRecurse(
  paths: ReadonlyMap<Stop['stop_id'], readonly Path[]>,
  stopId: Stop['stop_id'],
  pathSoFar: Path[]
): Path[] | undefined {
  const firstNonEmpty = paths.get(stopId)?.find(Boolean);

  if (firstNonEmpty) {
    pathSoFar.unshift(firstNonEmpty);
    if (firstNonEmpty.transfer_from) {
      // More of the path to follow
      return traversePathRecurse(paths, firstNonEmpty.transfer_from, pathSoFar);
    } else {
      // We found a departure path
      return pathSoFar;
    }
  } else {
    // This path goes nowhere!
    console.log(pathSoFar, paths.get(stopId));
    return undefined;
  }
}

export function traversePath(
  paths: ReadonlyMap<Stop['stop_id'], readonly Path[]>,
  arrival: Pick<Source, 'stop_id'>
) {
  return {
    path: traversePathRecurse(paths, arrival.stop_id, []),
    lastStop: arrival.stop_id,
  };
}

export interface Journey {
  depart?: {
    point: Point;
    walk: Walking;
  };
  trips: {
    trip: Trip;
    route: Route;
    stopTimes: {
      stop: Pick<Stop, 'stop_id' | 'stop_name' | 'stop_desc'>;
      arrival_time: ZonedTime;
      departure_time: ZonedTime;
      timepoint: boolean;
    }[];
    transfer?: Walking;
  }[];
  arrive?: {
    point: Point;
    walk: Walking;
  };
}

export async function journeyToDirections(
  repo: Repository,
  from: Point,
  to: Point,
  journey: ReturnType<typeof traversePath>
) {
  if (!journey.path) return undefined;

  // Starting at (from)

  // Walk 1 minute

  // TRIP: waimea-waimea-pm-0-0
  // 301 - Waimea
  //   Start at Lakeland @ 12:30PM
  //     After 1 stop
  //   End at Parker Ranch @ 12:45PM

  // Get off and wait for X minutes

  // TRIP: kohala-kona-0645am-nkohala-waim-kona-1
  // 75 - North Kohala / Waimea / Kailua-Kona
  //   Start at Parker Ranch @ 3:25PM
  //     After 1 stop
  //   End at Hwy 12/250 Intersection @ 3:45PM

  // Walk 1 minute

  // Ending at (to)
}

export async function directions(
  repo: Pick<
    Repository,
    'loadStopsSpatial' | 'loadStops' | 'loadCalendars' | 'loadTrips'
  >,
  from: Point,
  to: Point,
  departureTime: Temporal.PlainDateTime
): Promise<Journey[]> {
  const arriveAtReady = pointToSources(repo, to, departureTime);
  const departFrom = await pointToSources(repo, from, departureTime);

  const departDate = departureTime.toPlainDate();
  const paths = await raptorDirections(repo, departFrom, departDate);

  const arriveAt = await arriveAtReady;
  const journeys = arriveAt
    .map((arrival) => traversePath(paths, arrival))
    .filter(nestedNotNull('path'));

  console.log(journeys);
  return journeys;
}
