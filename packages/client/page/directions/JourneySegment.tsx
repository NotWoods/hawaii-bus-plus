import { Walking } from '@hawaii-bus-plus/presentation';
import { h } from 'preact';
import type { JourneyTripSegment } from '../../worker-nearby/directions/format';
import { TripSegment } from '../routes/timetable/stop-time/TripSegment';
import { WalkSegment } from '../routes/timetable/stop-time/WalkSegment';

interface Props {
  segment: JourneyTripSegment | Walking;
}

export function isJourneyTripSegment(
  segment: object // eslint-disable-line @typescript-eslint/ban-types
): segment is JourneyTripSegment {
  return 'trip' in segment;
}

export function JourneySegment({ segment }: Props) {
  if (isJourneyTripSegment(segment)) {
    return <TripSegment segment={segment} />;
  } else {
    return <WalkSegment walk={segment} />;
  }
}
