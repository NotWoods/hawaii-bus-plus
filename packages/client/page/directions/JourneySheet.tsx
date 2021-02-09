import { h } from 'preact';
import type { Journey } from '../../worker-nearby/directions/format';
import { JourneyHeader } from './JourneyHeader';
import { isJourneyTripSegment, JourneySegment } from './JourneySegment';

interface Props {
  journey: Journey;
  timeZone: string;
}

export function JourneySheet(props: Props) {
  return (
    <article class="bg-gray-50">
      <JourneyHeader
        journey={props.journey}
        timeZone={props.timeZone}
        onClose={() => {}}
      />
      <ul className="px-4">
        {props.journey.trips.map((segment, i) => {
          const key = isJourneyTripSegment(segment)
            ? segment.trip.trip_id
            : 'walk';
          return (
            <li key={`${key}-${i}`}>
              <JourneySegment segment={segment} />
            </li>
          );
        })}
      </ul>
    </article>
  );
}
