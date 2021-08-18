import { plainTimeToData } from '@hawaii-bus-plus/presentation';
import { PlainDaysTime } from '@hawaii-bus-plus/temporal-utils';
import { Agency, Stop, TimeString, Trip } from '@hawaii-bus-plus/types';
import { h } from 'preact';
import { Temporal } from '@js-temporal/polyfill';
import { StopTimeSegmentList } from '../../page/sheet/routes/timetable/stop-time/StopTimeSegmentList';

interface Props {
  trip: Trip;
  agency: Agency;
  stops: ReadonlyMap<Stop['stop_id'], Stop>;
}

function stopLink(stop: Stop) {
  return `/?stop=${stop.stop_id}`;
}

export function StopTimeSegments({ trip, agency, stops }: Props) {
  const nowDate = Temporal.Now.plainDateISO();
  function timeData(timeStr: TimeString) {
    return plainTimeToData(
      PlainDaysTime.from(timeStr),
      nowDate,
      agency.agency_timezone,
    );
  }

  return (
    <article id={trip.trip_id}>
      <a class="hover:underline" href={`#${trip.trip_id}`}>
        <h4 className="font-display font-medium text-xl mx-6 mb-2">
          {trip.trip_short_name}
        </h4>
      </a>
      <StopTimeSegmentList
        stopTimes={trip.stop_times.map((stopTime) => ({
          stop: stops.get(stopTime.stop_id)!,
          arrivalTime: timeData(stopTime.arrival_time),
          departureTime: timeData(stopTime.departure_time),
          timepoint: stopTime.timepoint,
        }))}
        timeZone={agency.agency_timezone}
        link={stopLink}
      />
    </article>
  );
}
