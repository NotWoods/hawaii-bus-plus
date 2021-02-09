import { formatPlainTimeRange } from '@hawaii-bus-plus/presentation';
import { h } from 'preact';
import { Journey } from '../../../worker-nearby/directions/format';
import { isJourneyTripSegment } from '../../directions/DirectionsSheet';
import { openJourney } from '../../router/action';
import { Link } from '../../router/Router';
import { RouteBadge } from '../../routes/badge/RouteBadge';
import { SmallRouteIcon } from '../../routes/badge/RouteIcon';
import { colorVariables } from '../../routes/props';

interface Props {
  journey: Journey;
  action: ReturnType<typeof openJourney>;
  href: string;
  onClick?(): void;
}

const gridTemplate = `
  'short fare' auto
  'long long' auto
  / auto min-content`;
const lineGridTemplate = `
  'badge dot' auto
  'badge line' 1fr
  / auto min-content`;

export function JourneyDirectionsResultItem(props: Props) {
  const { journey } = props;
  const durationRange = formatPlainTimeRange(
    journey.departTime,
    journey.arriveTime,
    'Pacific/Honolulu'
  );

  return (
    <Link
      action={props.action}
      href={props.href}
      class="flex flex-col w-32 shadow-xl h-full dark:text-white bg-gray-200 dark:bg-gray-700"
      onClick={props.onClick}
      style="scroll-snap-align: start"
    >
      <div
        class="grid items-center bg-gray-50 dark:bg-gray-600"
        style={{ gridTemplate }}
      >
        <time class="block font-medium p-2">
          <span class="text-2xl">20</span> <span>min</span>
        </time>
        <span class="bg-black px-1">$2.00</span>
        <time
          class="block text-sm p-2 pt-0"
          title={durationRange.localTime}
          dateTime={`${journey.departTime.string}/${journey.arriveTime.string}`}
          style={{ gridArea: 'long' }}
        >
          {durationRange.agencyTime}
        </time>
      </div>
      <ul class="p-4">
        {journey.trips
          .filter(isJourneyTripSegment)
          .map((segment) => segment.route)
          .map((route) => (
            <li
              class="flex justify-end h-12"
              style={colorVariables(route)}
              title={route.route_long_name}
            >
              <SmallRouteIcon class="self-start">
                {route.route_short_name}
              </SmallRouteIcon>
              <div class="flex flex-col ml-3 mr-6">
                <div
                  class="bg-white rounded-full ring-4 w-2 h-2 flex-none"
                  style={{ '--tw-ring-color': 'var(--route-color)' }}
                />
                <div
                  class="bg-route w-2 h-full rounded-b-full"
                  style={{ gridArea: 'line' }}
                />
              </div>
            </li>
          ))}
      </ul>
    </Link>
  );
}
