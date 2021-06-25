import { ComponentChildren, h } from 'preact';
import busIcon from '../../../../icons/directions_bus.svg';
import { Icon } from '../../../../icons/Icon';
import { BLANK } from '../../badge/RouteBadge';

export function BaseDetails(props: { children: ComponentChildren }) {
  return (
    <div class="px-4 snap-start">
      <div class="shadow p-4 pl-12 bg-white dark:bg-gray-700 relative h-full">
        {props.children}
      </div>
    </div>
  );
}

export function TripName(props: {
  tripShortName?: string;
  serviceDays?: string;
}) {
  const { tripShortName = BLANK, serviceDays = BLANK } = props;
  return (
    <header>
      <BaseDetails>
        <Icon
          src={busIcon}
          alt=""
          class="absolute top-5 left-3 dark:invert"
        />
        <p class="text-lg">{tripShortName}</p>
        <p>{serviceDays}</p>
      </BaseDetails>
    </header>
  );
}
