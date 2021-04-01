import { Trip } from '@hawaii-bus-plus/types';
import { h } from 'preact';
import type { Temporal } from 'proposal-temporal';
import type { DirectionDetails } from '../../../../worker-info/trip-details';
import { PlainDateInput } from '../../../time/input/PlainTimeInput';
import { NOW } from '../../../time/input/symbol';
import { TripDropdown } from './TripDropdown';

interface Props {
  directionsDetails: readonly DirectionDetails[];
  selectedTripId: Trip['trip_id'];
  tripDate: Temporal.PlainDate | NOW;
  onChangeTripDate(time: Temporal.PlainDate): void;
  setSelectedTrip(tripId: Trip['trip_id']): void;
}

export function TripSelector(props: Props) {
  return (
    <div class="flex flex-wrap justify-end gap-1">
      <PlainDateInput
        class="bg-gray-50 dark:bg-gray-800"
        aria-label="Departure date"
        value={props.tripDate}
        onChange={props.onChangeTripDate}
      />
      <TripDropdown
        directionsDetails={props.directionsDetails}
        selectedTripId={props.selectedTripId}
        setSelectedTrip={props.setSelectedTrip}
      />
    </div>
  );
}
