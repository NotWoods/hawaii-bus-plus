import { StopTimeData } from '@hawaii-bus-plus/presentation';
import { h } from 'preact';
import { useState } from 'preact/hooks';
import type { JourneyTripSegment } from '../../../../worker-nearby/directions/format';
import { classNames } from '../../../hooks/classnames';
import expandIcon from '../../../icons/expand_more.svg';
import { IconTw } from '../../../icons/Icon';
import { SmallRouteIcon } from '../../badge/RouteIcon';
import { colorVariables } from '../../props';
import { BaseSegment } from './BaseSegment';
import { StopTimeSegment } from './StopTimeSegment';
import './TripSegment.css';

interface Props {
  segment: JourneyTripSegment;
}

export function TripSegment(props: Props) {
  const { route, trip, agency } = props.segment;
  const [first, ...stopTimes] = props.segment.stopTimes;
  const last = stopTimes.pop()!;

  return (
    <section style={colorVariables(route)}>
      <header class="relative pl-6">
        <SmallRouteIcon class="absolute left-0 -ml-5 mt-3">
          {route.route_short_name}
        </SmallRouteIcon>
        <h3 class="font-display font-medium text-xl">
          {route.route_long_name}
        </h3>
        <h4 className="font-display font-medium text-lg">
          {trip.trip_short_name}
        </h4>
      </header>
      <StopTimeSegment stopTime={first} timeZone={agency.agency_timezone} />
      {stopTimes.length > 0 ? <TripCollapse stopTimes={stopTimes} /> : null}
      <StopTimeSegment stopTime={last} timeZone={agency.agency_timezone} />
    </section>
  );
}

interface TripCollapseProps {
  stopTimes: readonly StopTimeData[];
}

function TripCollapse({ stopTimes }: TripCollapseProps) {
  const [open, setOpen] = useState(false);

  return (
    <details
      class=""
      open={open}
      style={{ '--segment-padding': '0.125rem' }}
      onToggle={() => setOpen(!open)}
    >
      <summary class="flex -mx-2 overflow-hidden">
        <IconTw
          class={classNames(
            'transform transition-transform',
            open && 'rotate-180'
          )}
          style={{ gridArea: 'dot' }}
          src={expandIcon}
          alt={open ? 'Collapse' : 'Collapsed'}
        />
        <p class="ml-2">{stopTimes.length} stops</p>
      </summary>
      {stopTimes.map((stopTime) => (
        <BaseSegment
          href={`?stop=${stopTime.stop.stop_id}`}
          name={stopTime.stop.stop_name}
          small
        />
      ))}
    </details>
  );
}
