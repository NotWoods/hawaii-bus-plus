import { StopTimeData } from '@hawaii-bus-plus/presentation';
import React from 'react';
import { StopTimeSegment } from './StopTimeSegment';

interface Props {
  stopTime: StopTimeData;
  timeZone: string;
  first?: boolean;
  last?: boolean;
}

/**
 * Represents a single stop time.
 * @param props.timeZone The agency timezone to display times in.
 * @param props.first True if this item is the first in a trip (not first in a list)
 * @param props.last True if this item is the last in a trip (not last in a list)
 */
export function StopTimeItem({ stopTime, first, last, timeZone }: Props) {
  return (
    <StopTimeSegment
      href={`?stop=${stopTime.stop.stop_id}`}
      name={stopTime.stop.stop_name}
      description={stopTime.stop.stop_desc}
      time={{ ...stopTime, timeZone }}
      first={first}
      last={last}
    />
  );
}
