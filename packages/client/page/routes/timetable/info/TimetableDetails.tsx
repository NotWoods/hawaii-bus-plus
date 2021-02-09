import { last } from '@hawaii-bus-plus/utils';
import { h } from 'preact';
import { Temporal } from 'proposal-temporal';
import type { RouteDetails } from '../../../../worker-info/route-details';
import { IconTw } from '../../../icons/Icon';
import timeIcon from '../../../icons/access_time.svg';
import { EndedAt, ReachesAt, StartedFrom } from './StartedFrom';

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
    <aside class="shadow m-4 mb-0 p-4 pl-12 bg-white relative">
      <IconTw src={timeIcon} alt="" class="absolute top-5 left-4" />
      <ReachesAt closestTrip={closestTrip} />
      <StartedFrom
        stopTime={closestTrip.stopTimes[0]}
        agency={props.details.agency}
      />
      <EndedAt stopTime={last(closestTrip.stopTimes)} />
    </aside>
  );
}
