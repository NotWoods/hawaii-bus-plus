import { Temporal } from 'proposal-temporal';
import { Stop } from '../shared/gtfs-types';
import { PlainDaysTime } from '../shared/utils/temporal';
import { findClosestStops } from './closest-stops';
import { raptorDirections, Source, Path } from './directions/raptor';

export interface Point {
  stop_id?: Stop['stop_id'];
  position: google.maps.LatLngLiteral;
}

async function pointToSources(
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
    const closest = await findClosestStops(point.position);
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
  pathSoFar: Path[] = []
): Path[] | undefined {
  let firstNonEmpty: Path | undefined;
  paths.get(stopId)?.some((path) => {
    // .some and .forEach skip empty values
    // Use .some and return true as a rough
    // equivalent to breaking in a for loop.
    firstNonEmpty = path;
    return true;
  });

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
    return undefined;
  }
}

export async function directions(
  from: Point,
  to: Point,
  departureTime: Temporal.PlainDateTime
) {
  const arriveAtReady = pointToSources(to, departureTime);
  const departFrom = await pointToSources(from, departureTime);

  const paths = await raptorDirections(departFrom, departureTime.toPlainDate());
  const arriveAt = await arriveAtReady;
  const journeys = arriveAt
    .map((arrival) => ({
      path: traversePath(paths, arrival.stop_id),
      lastStop: arrival.stop_id,
    }))
    .filter(
      (journey): journey is { path: Path[]; lastStop: Stop['stop_id'] } =>
        journey.path != undefined
    );

  console.log(journeys);
  return journeys;
}
