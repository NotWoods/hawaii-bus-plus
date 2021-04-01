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
  children?: ComponentChildren;
}

function BaseDetails(props: { children: ComponentChildren }) {
  return (
    <div class="shadow p-4 pl-12 bg-white dark:bg-gray-700 relative snap-start">
      {props.children}
    </div>
  );
}

export function TripName(props: { details?: TripDetails }) {
  const { trip, serviceDays = BLANK } = props.details ?? {};
  return (
    <header>
      <BaseDetails>
        <Icon
          src={busIcon}
          alt=""
          class="absolute top-5 left-3 dark:filter-invert"
        />
        <p class="text-lg">{trip?.trip_short_name ?? BLANK}</p>
        <p>{serviceDays}</p>
      </BaseDetails>
    </header>
  );
}

export function TimetableDirectionsDetail(props: Props) {
  const { closestTrip } = props.directionDetails;

  return (
    <BaseDetails>
      <div class="inline-block">
        <Icon
          src={timeIcon}
          alt=""
          class="absolute top-5 left-3 dark:filter-invert"
        />
        <ReachesAt closestTrip={closestTrip} />
        <StartedFrom
          stopTime={closestTrip.stopTimes[0]}
          agency={props.agency}
        />
        <EndedAt stopTime={last(closestTrip.stopTimes)} />
      </div>
      {props.children}
    </BaseDetails>
  );
}
