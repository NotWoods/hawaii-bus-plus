import { h } from 'preact';
import { useCallback } from 'preact/hooks';
import type { Journey } from '@hawaii-bus-plus/workers/directions';
import { closeMainAction } from '../../router/action/main';
import { useDispatch, useSelector } from '../../router/hooks';
import { selectJourney } from '../../router/selector/main';
import { BaseSheet } from '../BaseSheet';
import { JourneyHeader } from './JourneyHeader';
import { isJourneyTripSegment, JourneySegment } from './JourneySegment';

interface Props {
  journey: Journey;
  timeZone: string;
  onClose?(): void;
}

export function JourneySheet(props: Props) {
  return (
    <BaseSheet loaded>
      <JourneyHeader
        journey={props.journey}
        timeZone={props.timeZone}
        onClose={props.onClose}
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

export function ConnectedJourneySheet(props: Pick<Props, 'timeZone'>) {
  const journey = useSelector(selectJourney);
  const dispatch = useDispatch();

  const onClose = useCallback(() => dispatch(closeMainAction()), [dispatch]);

  if (journey) {
    return (
      <JourneySheet
        journey={journey}
        timeZone={props.timeZone}
        onClose={onClose}
      />
    );
  } else {
    return null;
  }
}
