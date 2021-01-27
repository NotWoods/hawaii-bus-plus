import { formatWalkingTime, Walking } from '@hawaii-bus-plus/presentation';
import React from 'react';
import { StopTimeSegment } from '../routes/trip/StopTimeSegment';

interface Props {
  walk: Walking;
}

export function WalkSegment(props: Props) {
  return (
    <StopTimeSegment
      className="stoptime--walking px-15"
      name={formatWalkingTime(props.walk)}
    />
  );
}
