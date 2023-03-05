import {
  formatDurationParts,
  formatPlainTimeRange,
} from '@hawaii-bus-plus/presentation';
import type { Journey } from '@hawaii-bus-plus/workers/directions';
import clsx from 'clsx';

import { CloseButton } from '../../../components/Button/CloseButton';
import { useScreens } from '../../hooks';
import './JourneyHeader.css';

interface Props {
  journey: Journey;
  timeZone: string;
  onClose?(): void;
}

function JourneyDuration({
  duration,
  unitDisplay,
}: {
  duration: Journey['duration'];
  unitDisplay: 'short' | 'long';
}) {
  return (
    <time class="block font-display font-medium p-2" dateTime={duration.string}>
      {formatDurationParts(duration, unitDisplay).map((part) => {
        if (part.type === 'integer') {
          return (
            <span key={part.value} class="text-2xl">
              {part.value}
            </span>
          );
        } else {
          return part.value;
        }
      })}
    </time>
  );
}

export function JourneyHeader({ journey, timeZone, onClose }: Props) {
  const durationRange = formatPlainTimeRange(
    journey.departTime,
    journey.arriveTime,
    timeZone,
  );
  const unitDisplay = useScreens('md') ? 'long' : 'short';

  return (
    <header
      class={clsx(
        'journey__header grid relative items-center bg-white bg-opacity-20 border-b',
        onClose && 'journey__header--close',
      )}
    >
      <JourneyDuration duration={journey.duration} unitDisplay={unitDisplay} />
      <span class="bg-black px-1 text-white">{journey.fare}</span>
      <time
        class="block text-sm p-2 pt-0"
        title={durationRange.localTime}
        dateTime={`${journey.departTime.string}/${journey.arriveTime.string}`}
        style={{ gridArea: 'long' }}
      >
        {durationRange.agencyTime}
      </time>
      {onClose && <CloseButton class="absolute" onClick={onClose} />}
    </header>
  );
}
