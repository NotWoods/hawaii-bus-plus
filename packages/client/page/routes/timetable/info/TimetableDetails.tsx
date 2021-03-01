import { last } from '@hawaii-bus-plus/utils';
import { h } from 'preact';
import type { RouteDetails } from '../../../../worker-info/route-details';
import timeIcon from '../../../icons/access_time.svg';
import { Icon } from '../../../icons/Icon';
import { EndedAt, ReachesAt, StartedFrom } from './StartedFrom';

interface Props {
  details: RouteDetails;
  directionId: number;
}

export function TimetableDetails(props: Props) {
  const { directions } = props.details;
  const directionDetails = directions[props.directionId];

  if (!directionDetails) return null;
  const { closestTrip } = directionDetails;

  // TODO add string property to duration
  return (
    <aside class="shadow m-4 mb-0 p-4 pl-12 bg-white dark:bg-gray-700 relative">
      <Icon
        src={timeIcon}
        alt=""
        class="absolute top-5 left-3 dark:filter-invert"
      />
      <ReachesAt closestTrip={closestTrip} />
      <StartedFrom
        stopTime={closestTrip.stopTimes[0]}
        agency={props.details.agency}
      />
      <EndedAt stopTime={last(closestTrip.stopTimes)} />
    </aside>
  );
}
