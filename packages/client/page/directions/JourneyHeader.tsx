import { formatPlainTimeRange } from '@hawaii-bus-plus/presentation';
import { h } from 'preact';
import type { Journey } from '../../worker-nearby/directions/format';
import { classNames } from '../hooks/classnames';
import { CloseButton } from '../page-wrapper/alert/CloseButton';
import './JourneyHeader.css';

interface Props {
  journey: Journey;
  timeZone: string;
  onClose?(): void;
}

export function JourneyHeader({ journey, timeZone, onClose }: Props) {
  const durationRange = formatPlainTimeRange(
    journey.departTime,
    journey.arriveTime,
    timeZone
  );

  return (
    <header
      class={classNames(
        'journey__header grid relative items-center bg-white bg-opacity-20 border-b',
        onClose && 'journey__header--close'
      )}
    >
      <time class="block font-display font-medium p-2">
        <span class="text-2xl">20</span> <span>min</span>
      </time>
      <span class="bg-black px-1 text-white">$2.00</span>
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
