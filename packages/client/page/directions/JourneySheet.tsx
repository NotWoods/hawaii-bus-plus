import { h } from 'preact';
import { useContext } from 'preact/hooks';
import type { Journey } from '../../worker-nearby/directions/format';
import { closeJourneyAction } from '../router/action';
import { RouterContext } from '../router/Router';
import { BaseSheet } from '../routes/BaseSheet';
import { JourneyHeader } from './JourneyHeader';
import { isJourneyTripSegment, JourneySegment } from './JourneySegment';

interface Props {
  journey: Journey;
  timeZone: string;
}

export function JourneySheet(props: Props) {
  const { dispatch } = useContext(RouterContext);

  return (
    <BaseSheet>
      <JourneyHeader
        journey={props.journey}
        timeZone={props.timeZone}
        onClose={() => dispatch(closeJourneyAction())}
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
