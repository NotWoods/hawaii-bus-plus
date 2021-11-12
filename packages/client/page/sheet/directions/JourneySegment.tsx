import { Walking } from '@hawaii-bus-plus/presentation';
import type { JourneyTripSegment } from '@hawaii-bus-plus/workers/directions';
import { h } from 'preact';
import { TripSegment } from '../routes/timetable/stop-time/TripSegment';
import { WalkSegment } from '../routes/timetable/stop-time/WalkSegment';

interface Props {
  segment: JourneyTripSegment | Walking;
}

export function isJourneyTripSegment(
  segment: object, // eslint-disable-line @typescript-eslint/ban-types
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
