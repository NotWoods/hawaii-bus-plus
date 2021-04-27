import { h } from 'preact';
import { SmallRouteIcon } from '../../../all-pages/components/RouteIcon';
import type { Journey } from '../../../worker-nearby/directions/format';
import { JourneyHeader } from '../../directions/JourneyHeader';
import { isJourneyTripSegment } from '../../directions/JourneySegment';
import { useDuplicateKeys } from '../../hooks/useDuplicateKeys';
import { openJourney } from '../../router/action/main';
import { Link } from '../../router/Router';
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
  const makeKey = useDuplicateKeys();

  return (
    <Link
      action={props.action}
      href={props.href}
      class="flex flex-col snap-start w-32 md:w-auto shadow-xl h-full transition-colors text-gray-800 dark:text-white bg-blue-100 hover:bg-blue-200 dark:bg-blue-700 dark:hover:bg-blue-600"
      onClick={props.onClick}
    >
      <JourneyHeader journey={journey} timeZone="Pacific/Honolulu" />
      <ul class="p-4 flex flex-col md:flex-row">
        {journey.trips
          .filter(isJourneyTripSegment)
          .map((segment) => segment.route)
          .map((route) => (
            <li
              key={makeKey(route.route_id)}
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
