import { h } from 'preact';
import { Journey } from '../../../worker-nearby/directions/format';
import { JourneyHeader } from '../../directions/JourneyHeader';
import { isJourneyTripSegment } from '../../directions/DirectionsSheet';
import { openJourney } from '../../router/action';
import { Link } from '../../router/Router';
import { SmallRouteIcon } from '../../routes/badge/RouteIcon';
import { colorVariables } from '../../routes/props';
import {
  TripDecorDot,
  TripDecorLine,
} from '../../routes/timetable/stop-time/DecorLines';
import './JourneyDirectionsResultItem.css';

interface Props {
  journey: Journey;
  action: ReturnType<typeof openJourney>;
  href: string;
  onClick?(): void;
}

export function JourneyDirectionsResultItem(props: Props) {
  const { journey } = props;

  return (
    <Link
      action={props.action}
      href={props.href}
      class="flex flex-col w-32 md:w-auto shadow-xl h-full text-black dark:text-white bg-gray-200 dark:bg-gray-700"
      onClick={props.onClick}
      style="scroll-snap-align: start"
    >
      <JourneyHeader journey={journey} timeZone="Pacific/Honolulu" />
      <ul class="p-4 flex flex-col md:flex-row">
        {journey.trips
          .filter(isJourneyTripSegment)
          .map((segment) => segment.route)
          .map((route) => (
            <li
              class="journey-item__route grid justify-end md:justify-start h-12 md:h-auto md:w-12 gap-x-3 pr-6 md:p-0 md:gap-x-0 md:gap-y-3"
              style={colorVariables(route)}
              title={route.route_long_name}
            >
              <SmallRouteIcon class="journey-item__badge self-start justify-self-start">
                {route.route_short_name}
              </SmallRouteIcon>
              <TripDecorDot />
              <TripDecorLine gridArea="line" horizontal="md" rounded />
            </li>
          ))}
      </ul>
    </Link>
  );
}
