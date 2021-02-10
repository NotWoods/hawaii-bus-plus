import { Trip } from '@hawaii-bus-plus/types';
import { h } from 'preact';
import { Temporal } from 'proposal-temporal';
import { DirectionDetails } from '../../../../worker-info/trip-details';
import { PlainDateInput } from '../../../time/input/PlainTimeInput';

interface Props {
  details: DirectionDetails;
  tripTime: Temporal.PlainDateTime;
  onChangeTripTime(time: Temporal.PlainDateTime): void;
}

export function TripSelector(props: Props) {
  const { details, tripTime, onChangeTripTime } = props;
  const { closestTrip } = details;

  // TODO format trip time
  return (
    <div class="mx-4">
      <PlainDateInput
        aria-label="Date"
        value={tripTime.toPlainDate()}
        onChange={(date) =>
          onChangeTripTime(
            date.toPlainDateTime(closestTrip.stopTimes[0].arrivalTime.string)
          )
        }
      />
      <select
        class="bg-transparent"
        aria-label="Bus trip"
        value={closestTrip.trip.trip_id}
        onChange={(evt) => {
          const tripId = evt.currentTarget.value as Trip['trip_id'];
          const trip = details.allTrips.get(tripId)!;
          onChangeTripTime(tripTime.withPlainTime(trip.time));
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
