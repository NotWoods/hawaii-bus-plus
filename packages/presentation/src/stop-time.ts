import { Route, Stop } from '@hawaii-bus-plus/types';
import { PlainTimeData } from './time';

export interface StopTimeData {
  readonly stop: Stop;
  readonly routes: readonly Route[];
  readonly arrivalTime: PlainTimeData;
  readonly departureTime: PlainTimeData;
  readonly timepoint: boolean;
}
