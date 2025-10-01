import type { Route, Trip } from '@hawaii-bus-plus/types';
import type { Temporal } from '@js-temporal/polyfill';
import type { DirectionDetails } from '@hawaii-bus-plus/workers/info';

import { PlainDateInput } from '../../../../time/input/PlainTimeInput';
import { NOW } from '../../../../time/input/symbol';
import { TripDropdown } from './TripDropdown';

interface Props {
  directionHeaders: Route['directions'];
  directionsDetails: readonly DirectionDetails[];
  selectedTripId: Trip['trip_id'];
  tripDate: Temporal.PlainDate | NOW;
  onChangeTripDate(time: Temporal.PlainDate): void;
  setSelectedTrip(tripId: Trip['trip_id'] | NOW): void;
}

const tripSelectorClass =
  'bg-zinc-50 dark:bg-zinc-800 max-w-full ring-route focus:border-route';

export function TripSelector(props: Props) {
  return (
    <div class="flex flex-wrap justify-end m-4 gap-1">
      <PlainDateInput
        class={tripSelectorClass}
        aria-label="Departure date"
        value={props.tripDate}
        onChange={props.onChangeTripDate}
      />
      <TripDropdown
        class={tripSelectorClass}
        directionHeaders={props.directionHeaders}
        directionsDetails={props.directionsDetails}
        selectedTripId={props.selectedTripId}
        setSelectedTrip={props.setSelectedTrip}
      />
    </div>
  );
}
