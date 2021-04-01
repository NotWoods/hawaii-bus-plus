import { StopTimeData } from '@hawaii-bus-plus/presentation';
import { Stop } from '@hawaii-bus-plus/types';
import { h } from 'preact';
import { BaseSegment } from './BaseSegment';

interface Props {
  stopTime: Pick<
    StopTimeData,
    'stop' | 'arrivalTime' | 'departureTime' | 'timepoint'
  >;
  timeZone: string;
  gridArea?: string;
  link?(stop: Stop): string;
}

export function stopLink(stop: Stop) {
  return `?stop=${stop.stop_id}`;
}

export function StopTimeSegment({
  stopTime,
  timeZone,
  gridArea,
  link = stopLink,
}: Props) {
  return (
    <BaseSegment
      href={link(stopTime.stop)}
      name={stopTime.stop.stop_name}
      desc={stopTime.stop.stop_desc}
      time={{ ...stopTime, timeZone }}
      gridArea={gridArea}
    />
  );
}
