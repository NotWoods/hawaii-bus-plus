import { TimeString, Trip } from '@hawaii-bus-plus/types';
import { h } from 'preact';
import type { Temporal } from 'proposal-temporal';
import type { DirectionDetails } from '../../../../worker-info/trip-details';
import { PlainDateInput } from '../../../time/input/PlainTimeInput';
import { NOW } from '../../../time/input/symbol';

interface Props {
  details: DirectionDetails;
  tripDate: Temporal.PlainDate | NOW;
  onChangeTripDate(time: Temporal.PlainDate): void;
  onChangeTripTime(time: TimeString): void;
}

export function TripSelector(props: Props) {
  const { details, tripDate, onChangeTripTime } = props;
  const { closestTrip } = details;

  // TODO format trip time
  return (
    <div class="flex flex-wrap justify-end gap-1">
      <PlainDateInput
        class="bg-gray-50 dark:bg-gray-800"
        aria-label="Departure date"
        value={tripDate}
        onChange={(date) => props.onChangeTripDate(date)}
      />
      <select
        class="border-current bg-gray-50 dark:bg-gray-800"
        aria-label="Bus trip"
        value={closestTrip.trip.trip_id}
        onChange={(evt) => {
          const tripId = evt.currentTarget.value as Trip['trip_id'];
          const trip = details.allTrips.get(tripId)!;
          onChangeTripTime(trip.time);
        }}
      >
        {Array.from(details.allTrips.values(), (trip) => (
          <option key={trip.tripId} value={trip.tripId}>
            {trip.shortName}
          </option>
        ))}
      </select>
    </div>
  );
}
