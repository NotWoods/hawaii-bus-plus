import type { BikeStationPoint } from '@hawaii-bus-plus/presentation';

import { PlaceInfo } from './PlaceInfo';
import { PointBase } from './PointBase';
import { PointDescription, PointHeader } from './PointInfo';

interface Props {
  point: BikeStationPoint;
}

export function BikeStationCard({ point }: Props) {
  const position = point.position;
  return (
    <PointBase position={position}>
      <PointHeader>{point.name}</PointHeader>
      <PointDescription>Bike station</PointDescription>
      <PlaceInfo position={position} />
    </PointBase>
  );
}
