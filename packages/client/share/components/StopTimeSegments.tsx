import { plainTimeToData } from '@hawaii-bus-plus/presentation';
import { PlainDaysTime } from '@hawaii-bus-plus/temporal-utils';
import { Agency, Stop, TimeString, Trip } from '@hawaii-bus-plus/types';
import { h } from 'preact';
import { Temporal } from 'proposal-temporal';
import { StopTimesCollapsible } from '../../page/routes/timetable/stop-time/StopTimesCollapsible';

interface Props {
  trip: Trip;
  agency: Agency;
  stops: ReadonlyMap<Stop['stop_id'], Stop>;
}

function stopLink(stop: Stop) {
  return `/?stop=${stop.stop_id}`;
}

export function StopTimeSegments({ trip, agency, stops }: Props) {
  const nowDate = Temporal.now.plainDateISO();
  function timeData(timeStr: TimeString) {
    return plainTimeToData(
      PlainDaysTime.from(timeStr),
      nowDate,
      agency.agency_timezone
    );
  }

  return (
    <li>
      <section id={trip.trip_id}>
        <header>
          <h3 className="font-display font-medium text-lg">
            {trip.trip_short_name}
          </h3>
        </header>
        <StopTimesCollapsible
          stopTimes={trip.stop_times.map((stopTime) => ({
            stop: stops.get(stopTime.stop_id)!,
            arrivalTime: timeData(stopTime.arrival_time),
            departureTime: timeData(stopTime.departure_time),
            timepoint: stopTime.timepoint,
          }))}
          timeZone={agency.agency_timezone}
          link={stopLink}
        />
      </section>
    </li>
  );
}
