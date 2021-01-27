import { StopTimeData } from '@hawaii-bus-plus/presentation';
import { Stop } from '@hawaii-bus-plus/types';
import { lastIndex, skipUntil } from '@hawaii-bus-plus/utils';
import React from 'react';
import { StopTimeItem } from './StopTimeItem';

interface Props {
  stopTimes: readonly StopTimeData[];
  skipToStop?: Stop['stop_id'];
  agencyTimezone: string;
}

export function StopTimesList(props: Props) {
  // Skip until you reach the given stop
  let entries = props.stopTimes.entries();
  if (props.skipToStop) {
    entries = skipUntil(
      props.stopTimes.entries(),
      ([, stopTime]) => stopTime.stop.stop_id === props.skipToStop
    );
  }
  const keySoFar = new Map<Stop['stop_id'], number>();

  return (
    <ul>
      {Array.from(entries, ([i, stopTime]) => {
        const stopId = stopTime.stop.stop_id;
        const keySuffix = keySoFar.get(stopId) || 0;
        keySoFar.set(stopId, keySuffix + 1);

        return (
          <StopTimeItem
            key={`${stopId}${keySuffix}`}
            stopId={stopTime.stop.stop_id}
            {...stopTime}
            first={i === 0}
            last={i === lastIndex(props.stopTimes)}
            agencyTimezone={props.agencyTimezone}
          />
        );
      })}
    </ul>
  );
}
