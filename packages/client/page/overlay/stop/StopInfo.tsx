import type { StopDetails } from '@hawaii-bus-plus/workers/info';
import { h } from 'preact';
import { PointInfo } from './PointInfo';

export function StopInfo({ stop }: { stop: StopDetails }) {
  return (
    <PointInfo
      stopsTitle="Adjacent stops"
      routesTitle="Connected routes"
      stops={stop.transfers.map((transfer) => transfer.toStop)}
      routes={stop.routes}
      agencies={stop.agencies}
    />
  );
}
