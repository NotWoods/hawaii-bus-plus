import { formatPlainTimeRange, Point } from '@hawaii-bus-plus/presentation';
import { h } from 'preact';
import { Temporal } from 'proposal-temporal';
import type {
  Journey,
  JourneyTripSegment,
} from '../../../worker-nearby/directions/format';
import { openJourney } from '../../router/action';
import { Link } from '../../router/Router';
import { directionsToParams } from '../../router/url';
import { RouteBadges } from '../../routes/badge/RouteBadge';
import './DirectionsJourneyResult.css';

interface Props {
  journey: Journey;
  from: Point;
  to: Point;
  departureTime: Temporal.PlainDateTime;
  onClick?(): void;
}

export function DirectionsJourneyResults(props: Props) {
  const { journey } = props;
  const params = directionsToParams({
    depart: props.from,
    arrive: props.to,
    departureTime: props.departureTime.toString(),
  });

  const time = formatPlainTimeRange(
    journey.departTime,
    journey.arriveTime,
    'Pacific/Honolulu'
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
          <RouteBadges
            routes={journey.trips
              .filter(
                (segment): segment is JourneyTripSegment => 'trip' in segment
              )
              .map((segment) => segment.route)}
          />
        </p>
        <time
          className="sidebar-link-subtitle m-0 font-size-12"
          title={time.localTime}
          dateTime={`${journey.departTime.string}/${journey.arriveTime.string}`}
        >
          {time.agencyTime}
        </time>
      </Link>
    </li>
  );
}
