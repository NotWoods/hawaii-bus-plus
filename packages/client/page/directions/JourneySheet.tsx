import { h } from 'preact';
import { useContext } from 'preact/hooks';
import type { Journey } from '../../worker-nearby/directions/format';
import { closeMainAction } from '../router/action/main';
import { RouterContext } from '../router/Router';
import { BaseSheet } from '../routes/BaseSheet';
import { useTripBounds } from '../routes/timetable/useTripBounds';
import { JourneyHeader } from './JourneyHeader';
import { isJourneyTripSegment, JourneySegment } from './JourneySegment';

interface Props {
  journey: Journey;
  timeZone: string;
}

export function JourneySheet(props: Props) {
  const { dispatch } = useContext(RouterContext);

  useTripBounds(props.journey.bounds);

  return (
    <BaseSheet loaded>
      <JourneyHeader
        journey={props.journey}
        timeZone={props.timeZone}
        onClose={() => dispatch(closeMainAction())}
      />
      <ul className="px-8">
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
    </BaseSheet>
  );
}
