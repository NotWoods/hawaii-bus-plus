import { StopTimeData } from '@hawaii-bus-plus/presentation';
import { h } from 'preact';
import { BaseSegment } from './BaseSegment';

interface Props {
  stopTime: StopTimeData;
  timeZone: string;
  gridArea?: string;
}

export function StopTimeSegment({ stopTime, timeZone, gridArea }: Props) {
  return (
    <BaseSegment
      href={`?stop=${stopTime.stop.stop_id}`}
      name={stopTime.stop.stop_name}
      desc={stopTime.stop.stop_desc}
      time={{ ...stopTime, timeZone }}
      gridArea={gridArea}
    />
  );
}
