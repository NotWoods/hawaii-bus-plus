import { h } from 'preact';
import { useState } from 'preact/hooks';
import { SmallRouteIcon } from '../../../../../all-pages/components/RouteIcon';
import type { JourneyTripSegment } from '../../../../../worker-nearby/directions/format';
import { colorVariables } from '../../props';
import { StopTimesCollapsible } from './StopTimesCollapsible';

interface Props {
  segment: JourneyTripSegment;
}

export function TripSegment(props: Props) {
  const { route, trip, agency } = props.segment;
  const [open, setOpen] = useState(false);

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
      <StopTimesCollapsible
        stopTimes={props.segment.stopTimes}
        timeZone={agency.agency_timezone}
        open={open}
        onToggle={() => setOpen(!open)}
      />
    </section>
  );
}
