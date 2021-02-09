import { formatDuration } from '@hawaii-bus-plus/presentation';
import { last } from '@hawaii-bus-plus/utils';
import { h } from 'preact';
import { Temporal } from 'proposal-temporal';
import type { RouteDetails } from '../../../../worker-info/route-details';
import { Link } from '../../../router/Router';
import { EndedAt, StartedFrom } from './StartedFrom';

interface Props {
  details: RouteDetails;
  directionId: number;
  tripTime: Temporal.PlainDateTime;
}

export function TimetableDetails(props: Props) {
  const { directions } = props.details;
  const directionDetails = directions[props.directionId];

  if (!directionDetails) return null;
  const { closestTrip } = directionDetails;

  // TODO add string property to duration
  return (
    <aside>
      <p class="text-lg">
        {'Reaches '}
        <Link href={`?stop=${closestTrip.stop}`}>
          {closestTrip.stopName}
        </Link>{' '}
        <time>{formatDuration(closestTrip.offset)}</time>
      </p>
      <StartedFrom
        stopTime={closestTrip.stopTimes[0]}
        agency={props.details.agency}
      />
      <EndedAt stopTime={last(closestTrip.stopTimes)} />
    </aside>
  );
}
