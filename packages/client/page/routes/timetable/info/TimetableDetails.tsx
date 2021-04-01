import { Agency } from '@hawaii-bus-plus/types';
import { last } from '@hawaii-bus-plus/utils';
import { ComponentChildren, h } from 'preact';
import {
  DirectionDetails,
  TripDetails,
} from '../../../../worker-info/trip-details';
import timeIcon from '../../../icons/access_time.svg';
import busIcon from '../../../icons/directions_bus.svg';
import { Icon } from '../../../icons/Icon';
import { BLANK } from '../../badge/RouteBadge';
import { EndedAt, ReachesAt, StartedFrom } from './StartedFrom';

interface Props {
  directionDetails: DirectionDetails;
  agency: Agency;
}

function BaseDetails(props: { icon: string; children: ComponentChildren }) {
  return (
    <aside class="shadow m-4 mb-0 p-4 pl-12 bg-white dark:bg-gray-700 relative">
      <Icon
        src={props.icon}
        alt=""
        class="absolute top-5 left-3 dark:filter-invert"
      />
      {props.children}
    </aside>
  );
}

export function TripName(props: { details?: TripDetails }) {
  const { trip, serviceDays = BLANK } = props.details ?? {};
  return (
    <BaseDetails icon={busIcon}>
      <p class="text-lg">{trip?.trip_short_name ?? BLANK}</p>
      <p>{serviceDays}</p>
    </BaseDetails>
  );
}

export function TimetableDetails({ agency, directionDetails }: Props) {
  const { closestTrip } = directionDetails;

  return (
    <BaseDetails icon={timeIcon}>
      <ReachesAt closestTrip={closestTrip} />
      <StartedFrom stopTime={closestTrip.stopTimes[0]} agency={agency} />
      <EndedAt stopTime={last(closestTrip.stopTimes)} />
    </BaseDetails>
  );
}
