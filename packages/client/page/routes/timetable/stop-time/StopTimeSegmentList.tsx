import { StopTimeData } from '@hawaii-bus-plus/presentation';
import { Stop } from '@hawaii-bus-plus/types';
import { h } from 'preact';
import { StopTimeSegment } from './StopTimeSegment';

interface Props {
  stopTimes: readonly StopTimeData[];
  skipToStop?: Stop['stop_id'];
  timeZone: string;
}

export function StopTimeSegmentList(props: Props) {
  const keySoFar = new Map<Stop['stop_id'], number>();

  return (
    <ul class="px-8">
      {props.stopTimes.map((stopTime) => {
        const stopId = stopTime.stop.stop_id;
        const keySuffix = keySoFar.get(stopId) ?? 0;
        keySoFar.set(stopId, keySuffix + 1);

        return (
          <li>
            <StopTimeSegment
              key={`${stopId}${keySuffix}`}
              stopTime={stopTime}
              timeZone={props.timeZone}
            />
          </li>
        );
      })}
    </ul>
  );
}
