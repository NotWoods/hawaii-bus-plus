import type { Route, Trip } from '@hawaii-bus-plus/types';
import type { DirectionDetails } from '@hawaii-bus-plus/workers/info';

import { NOW } from '../../../../time/input/symbol';
import { BLANK } from '../../badge/RouteBadge';

interface Props {
  directionHeaders: Route['directions'];
  directionsDetails: readonly DirectionDetails[];
  selectedTripId: Trip['trip_id'];
  setSelectedTrip(tripId: Trip['trip_id'] | NOW): void;
  class?: string;
}

export function TripDropdown(props: Props) {
  return (
    <select
      class={props.class}
      aria-label="Bus trip"
      value={props.selectedTripId}
      onChange={(evt) => {
        const { value } = evt.currentTarget;
        if (value === '') {
          props.setSelectedTrip(NOW);
        } else {
          const tripId = value as Trip['trip_id'];
          props.setSelectedTrip(tripId);
        }
      }}
    >
      <option value="">Now</option>
      {props.directionsDetails.map((direction, id) => (
        <optgroup key={id} label={props.directionHeaders[id as 0 | 1] ?? BLANK}>
          {Array.from(direction.allTrips.values(), (trip) => (
            <option key={trip.tripId} value={trip.tripId}>
              {trip.shortName}
            </option>
          ))}
        </optgroup>
      ))}
    </select>
  );
}
