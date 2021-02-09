import { formatPlainTimeRange } from '@hawaii-bus-plus/presentation';
import { h } from 'preact';
import { Journey } from '../../worker-nearby/directions/format';
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
    <header class="journey__header grid relative items-center bg-white bg-opacity-20 border-b">
      <time class="block font-medium p-2">
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
