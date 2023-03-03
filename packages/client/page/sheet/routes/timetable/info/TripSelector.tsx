import { Route, Trip } from '@hawaii-bus-plus/types';
import type { Temporal } from '@js-temporal/polyfill';
import type { DirectionDetails } from '@hawaii-bus-plus/workers/info';

import { PlainDateInput } from '../../../../time/input/PlainTimeInput';
import { NOW } from '../../../../time/input/symbol';
import { TripDropdown } from './TripDropdown';
import './TripSelector.css';

interface Props {
  directionHeaders: Route['directions'];
  directionsDetails: readonly DirectionDetails[];
  selectedTripId: Trip['trip_id'];
  tripDate: Temporal.PlainDate | NOW;
  onChangeTripDate(time: Temporal.PlainDate): void;
  setSelectedTrip(tripId: Trip['trip_id'] | NOW): void;
}

export function TripSelector(props: Props) {
  return (
    <div class="text-right m-4">
      <PlainDateInput
        class="trip-selector__input mb-1"
        aria-label="Departure date"
        value={props.tripDate}
        onChange={props.onChangeTripDate}
      />
      <TripDropdown
        class="trip-selector__input"
        directionHeaders={props.directionHeaders}
        directionsDetails={props.directionsDetails}
        selectedTripId={props.selectedTripId}
        setSelectedTrip={props.setSelectedTrip}
      />
    </div>
  );
}
