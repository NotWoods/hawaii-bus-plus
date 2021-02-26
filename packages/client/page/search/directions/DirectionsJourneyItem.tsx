import { Point } from '@hawaii-bus-plus/presentation';
import { h } from 'preact';
import type { Journey } from '../../../worker-nearby/directions/format';
import { openJourney } from '../../router/action/main';
import { directionsToParams } from '../../router/url';
import { JourneyDirectionsResultItem } from './JourneyDirectionsResultItem';

interface Props {
  journey: Journey;
  from: Point;
  to: Point;
  departureTime: string;
  onClick?(): void;
}

export function DirectionsJourneyItem(props: Props) {
  const { journey } = props;
  const params = directionsToParams({
    depart: props.from,
    arrive: props.to,
    departureTime: props.departureTime,
  });

  return (
    <li class="mb-4">
      <JourneyDirectionsResultItem
        action={openJourney(
          props.from,
          props.to,
          props.departureTime,
          props.journey
        )}
        href={`/directions?${params.toString()}`}
        journey={journey}
        onClick={props.onClick}
      />
    </li>
  );
}
