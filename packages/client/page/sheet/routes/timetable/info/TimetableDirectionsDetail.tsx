import { Agency } from '@hawaii-bus-plus/types';
import { last } from '@hawaii-bus-plus/utils';
import { ComponentChildren, h } from 'preact';
import { Icon } from '../../../../../assets/icons/Icon';
import { access_time } from '../../../../../assets/icons/paths';
import { DirectionDetails } from '../../../../../workers/info';
import { EndedAt, ReachesAt, StartedFrom } from './StartedFrom';
import { BaseDetails } from './TripName';

interface Props {
  directionDetails: DirectionDetails;
  agency: Agency;
  children?: ComponentChildren;
  active?: boolean;
}

export function TimetableDirectionsDetail(props: Props) {
  const { closestTrip } = props.directionDetails;
  const tabIndex = props.active ? 0 : -1;

  return (
    <BaseDetails>
      <div class="inline-block">
        <Icon
          src={access_time}
          alt=""
          class="absolute top-5 left-3 dark:invert"
        />
        <ReachesAt closestTrip={closestTrip} tabIndex={tabIndex} />
        <StartedFrom
          stopTime={closestTrip.stopTimes[0]}
          agency={props.agency}
          tabIndex={tabIndex}
        />
        <EndedAt stopTime={last(closestTrip.stopTimes)} tabIndex={tabIndex} />
        <p>{closestTrip.serviceDays}</p>
      </div>
      {props.children}
    </BaseDetails>
  );
}
