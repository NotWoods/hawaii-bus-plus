import { StopTimeData } from '@hawaii-bus-plus/presentation';
import { Agency } from '@hawaii-bus-plus/types';
import { h } from 'preact';
import { Link } from '../../../router/Router';
import { ScheduleTime } from '../../trip/ScheduleTime';

interface EndProps {
  stopTime: StopTimeData;
}

export function EndedAt({ stopTime }: EndProps) {
  return (
    <p>
      Last stop at
      <Link href={`?stop=${stopTime.stop.stop_id}`}>
        {stopTime.stop.stop_name}
      </Link>
    </p>
  );
}

interface StartProps extends EndProps {
  agency: Pick<Agency, 'agency_timezone'>;
}

export function StartedFrom({ stopTime, agency }: StartProps) {
  return (
    <p>
      Started from{' '}
      <Link href={`?stop=${stopTime.stop.stop_id}`}>
        {stopTime.stop.stop_name}
      </Link>{' '}
      at{' '}
      <ScheduleTime
        time={stopTime.departureTime}
        approximate={!stopTime.timepoint}
        agencyTimezone={agency.agency_timezone}
      />
    </p>
  );
}
