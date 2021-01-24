import { Repository } from '@hawaii-bus-plus/data';
import { Stop } from '@hawaii-bus-plus/types';
import { nestedNotNull, PlainDaysTime } from '@hawaii-bus-plus/utils';
import { Temporal } from 'proposal-temporal';
import { findClosestStops } from './closest-stops';
import { Path, raptorDirections, Source } from './directions/raptor';

export interface Point {
  stop_id?: Stop['stop_id'];
  position: google.maps.LatLngLiteral;
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

function traversePath(
  paths: ReadonlyMap<Stop['stop_id'], readonly Path[]>,
  stopId: Stop['stop_id'],
  pathSoFar: Path[]
): Path[] | undefined {
  const firstNonEmpty = paths.get(stopId)?.find(Boolean);

  if (firstNonEmpty) {
    pathSoFar.unshift(firstNonEmpty);
    if (firstNonEmpty.transfer_from) {
      // More of the path to follow
      return traversePath(paths, firstNonEmpty.transfer_from, pathSoFar);
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

export interface Journey {
  path: Path[];
  lastStop: Stop['stop_id'];
}

export function traverseJourney(
  paths: ReadonlyMap<Stop['stop_id'], readonly Path[]>,
  arrival: Pick<Source, 'stop_id'>
) {
  return {
    path: traversePath(paths, arrival.stop_id, []),
    lastStop: arrival.stop_id,
  };
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
    .map((arrival) => traverseJourney(paths, arrival))
    .filter(nestedNotNull('path'));

  console.log(journeys);
  return journeys;
}
