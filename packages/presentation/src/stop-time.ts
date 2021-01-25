import { Stop } from '@hawaii-bus-plus/types';
import { PlainTimeData } from './time';

export interface StopTimeData {
  readonly stop: Stop;
  readonly arrivalTime: PlainTimeData;
  readonly departureTime: PlainTimeData;
  readonly timepoint: boolean;
}
