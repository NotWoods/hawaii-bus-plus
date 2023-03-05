import { StopTimeData } from '@hawaii-bus-plus/presentation';
import { Stop } from '@hawaii-bus-plus/types';

import { useDuplicateKeys } from '../../../../hooks/useDuplicateKeys';
import { useListKeyboardNav } from '../../../../hooks/useListKeyboardNav';
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

export function StopTimeSegmentList(props: Props) {
  const makeKey = useDuplicateKeys();

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
        <li key={makeKey(stopTime.stop.stop_id)}>
          <StopTimeSegment
            stopTime={stopTime}
            timeZone={props.timeZone}
            link={props.link}
          />
        </li>
      ))}
    </ul>
  );
}
