import type { Repository } from '@hawaii-bus-plus/data';
import type { Point } from '@hawaii-bus-plus/presentation';
import { PlainDaysTime } from '@hawaii-bus-plus/temporal-utils';
import type { Stop } from '@hawaii-bus-plus/types';
import { Temporal } from '@js-temporal/polyfill';
import { isDefined } from 'ts-extras';
import { findClosestStops } from '../nearby/closest/closest-stops';
import { journeyToDirections, type Journey } from './format';
import {
  raptorDirections,
  type CompletePath,
  type Path,
  type PathSegment,
  type PathStart,
  type Source,
} from './paths/raptor';

export interface DirectionsResult {
  journeys: readonly Journey[];
  depatureTime: string;
  tomorrow: string;
}

async function pointToSources(
  repo: Pick<Repository, 'loadStopsSpatial'>,
  point: Point,
  departureTime: Temporal.PlainDateTime,
): Promise<Source[]> {
  const time = new PlainDaysTime(0, departureTime.toPlainTime());
  if (point.type === 'stop') {
    return [
      {
        stop_id: point.stopId,
        departure_time: time,
      },
    ];
  } else {
    const closest = await findClosestStops(repo, point.position);
    return closest.map((stop) => {
      // Rough walking speed is 1 meter per second
      const timeWithWalking = time.add({ seconds: Math.floor(stop.distance) });
      return {
        stop_id: stop.stop_id,
        departure_time: timeWithWalking,
      };
    });
  }
}

function traversePathRecurse(
  paths: ReadonlyMap<Stop['stop_id'], Path>,
  stopId: Stop['stop_id'],
  pathSoFar: (PathStart | PathSegment)[],
): CompletePath | undefined {
  const firstNonEmpty = paths.get(stopId)?.find(Boolean);

  if (firstNonEmpty) {
    pathSoFar.unshift(firstNonEmpty);
    if (firstNonEmpty.transferFrom) {
      // More of the path to follow
      return traversePathRecurse(paths, firstNonEmpty.transferFrom, pathSoFar);
    } else {
      // We found a departure path
      return pathSoFar as CompletePath;
    }
  } else {
    // This path goes nowhere!
    console.log(pathSoFar, paths.get(stopId));
    return undefined;
  }
}

export function traversePath(
  paths: ReadonlyMap<Stop['stop_id'], Path>,
  arrival: Pick<Source, 'stop_id'>,
) {
  return traversePathRecurse(paths, arrival.stop_id, []);
}

export async function directions(
  repo: Pick<
    Repository,
    | 'loadStopsSpatial'
    | 'loadStops'
    | 'loadCalendars'
    | 'loadTrips'
    | 'loadTrip'
    | 'loadRoutes'
    | 'loadAgencies'
  >,
  from: Point,
  to: Point,
  departureTime: Temporal.PlainDateTime,
): Promise<DirectionsResult> {
  const arriveAtReady = pointToSources(repo, to, departureTime);
  const departFrom = await pointToSources(repo, from, departureTime);

  const departDate = departureTime.toPlainDate();
  const paths = await raptorDirections(repo, departFrom, departDate);

  const arriveAt = await arriveAtReady;
  const journeys = await Promise.all(
    arriveAt
      .map((arrival) => traversePath(paths, arrival))
      .filter(isDefined)
      .map((path) => journeyToDirections(repo, from, to, departureTime, path)),
  );

  return {
    journeys: journeys,
    depatureTime: departureTime.toString(),
    tomorrow: departureTime
      .add({ days: 1 })
      .with({ hour: 0, minute: 0, second: 0 })
      .toString(),
  };
}
