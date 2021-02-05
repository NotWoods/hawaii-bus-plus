import { Point } from '@hawaii-bus-plus/presentation';
import { last } from 'lodash';
import { h } from 'preact';
import { Temporal } from 'proposal-temporal';
import type {
  Journey,
  JourneyTripSegment,
} from '../../../worker-nearby/directions/format';
import { openJourney } from '../../router/action';
import { Link } from '../../router/Router';
import { directionsToParams } from '../../router/url';
import { RouteBadge } from '../../stop/RouteBadge';
import './DirectionsJourneyResult.css';

interface Props {
  journey: Journey;
  from: Point;
  to: Point;
  departureTime: Temporal.PlainDateTime;
  onClick?(): void;
}

declare global {
  namespace Intl {
    interface DateTimeFormat {
      formatRange(startDate: Date | number, endDate: Date | number): string;
    }
  }
}

const durationFormat = new Intl.DateTimeFormat([], {
  timeStyle: 'short',
});

export function DirectionsJourneyResults(props: Props) {
  const { journey } = props;
  const params = directionsToParams({
    depart: props.from,
    arrive: props.to,
    departureTime: props.departureTime.toString(),
  });

  const startTime = new Date(
    (journey
      .trips[0] as JourneyTripSegment).stopTimes[0].departureTime.epochMilliseconds
  );
  const endTime = new Date(
    last(
      (last(journey.trips) as JourneyTripSegment).stopTimes
    )!.arrivalTime.epochMilliseconds
  );

  return (
    <li class="d-block">
      <Link
        action={openJourney(
          props.from,
          props.to,
          props.departureTime.toString(),
          props.journey
        )}
        href={`/directions?${params.toString()}`}
        className="sidebar-link directions-link"
        onClick={props.onClick}
      >
        <p className="sidebar-link-title mt-0">
          {journey.trips
            .filter(
              (segment): segment is JourneyTripSegment => 'trip' in segment
            )
            .map((segment) => (
              <RouteBadge key={segment.trip.trip_id} route={segment.route} />
            ))}
        </p>
        <p className="sidebar-link-subtitle m-0 font-size-12">
          {durationFormat.formatRange(startTime, endTime)}
        </p>
      </Link>
    </li>
  );
}
