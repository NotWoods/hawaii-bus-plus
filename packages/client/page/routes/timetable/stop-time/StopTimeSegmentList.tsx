import { StopTimeData } from '@hawaii-bus-plus/presentation';
import { Stop } from '@hawaii-bus-plus/types';
import { h } from 'preact';
import { useListKeyboardNav } from '../../../hooks/useListKeyboardNav';
import { StopTimeSegment } from './StopTimeSegment';

interface Props {
  stopTimes: readonly Pick<
    StopTimeData,
    'stop' | 'arrivalTime' | 'departureTime' | 'timepoint'
  >[];
  skipToStop?: Stop['stop_id'];
  timeZone: string;
  link?(stop: Stop): string;
}

export function stopTimeKeys() {
  const keySoFar = new Map<Stop['stop_id'], number>();

  return function makeKey(stopId: Stop['stop_id']) {
    const keySuffix = keySoFar.get(stopId) ?? 0;
    keySoFar.set(stopId, keySuffix + 1);
    return `${stopId}${keySuffix}`;
  };
}

export function StopTimeSegmentList(props: Props) {
  const makeKey = stopTimeKeys();

  const handleArrowKey = useListKeyboardNav((evt, listItem) => {
    switch (evt.key) {
      case 'ArrowUp':
        return listItem.previousElementSibling;
      case 'ArrowDown':
        return listItem.nextElementSibling;
    }
    return undefined;
  }, []);

  return (
    <ul class="px-8" onKeyDown={handleArrowKey}>
      {props.stopTimes.map((stopTime) => (
        <li>
          <StopTimeSegment
            key={makeKey(stopTime.stop.stop_id)}
            stopTime={stopTime}
            timeZone={props.timeZone}
            link={props.link}
          />
        </li>
      ))}
    </ul>
  );
}
