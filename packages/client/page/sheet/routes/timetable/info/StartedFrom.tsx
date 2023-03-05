import { StopTimeData } from '@hawaii-bus-plus/presentation';
import { Agency } from '@hawaii-bus-plus/types';

import type { DirectionDetails } from '@hawaii-bus-plus/workers/info';
import { Link } from '../../../../router/Router';
import { RelativeDurationElement } from '../../../../time/DurationElement';
import { PlainTimeElement } from '../../../../time/PlainTimeElement';

const linkClass = 'hover:underline';

interface ReachesProps {
  closestTrip: DirectionDetails['closestTrip'];
  tabIndex?: number;
}

export function ReachesAt({ closestTrip, tabIndex }: ReachesProps) {
  return (
    <p class="text-lg">
      {'Reaches '}
      <Link
        href={`?stop=${closestTrip.stop}`}
        class={linkClass}
        tabIndex={tabIndex}
      >
        {closestTrip.stopName}
      </Link>{' '}
      <RelativeDurationElement duration={closestTrip.offset} />
    </p>
  );
}

interface EndProps {
  stopTime: StopTimeData;
  tabIndex?: number;
}

export function EndedAt({ stopTime, tabIndex }: EndProps) {
  return (
    <p>
      {'Last stop at '}
      <Link
        href={`?stop=${stopTime.stop.stop_id}`}
        class={linkClass}
        tabIndex={tabIndex}
      >
        {stopTime.stop.stop_name}
      </Link>
    </p>
  );
}

interface StartProps extends EndProps {
  agency: Pick<Agency, 'agency_timezone'>;
}

export function StartedFrom({ stopTime, agency, tabIndex }: StartProps) {
  return (
    <p>
      Started from{' '}
      <Link
        href={`?stop=${stopTime.stop.stop_id}`}
        class={linkClass}
        tabIndex={tabIndex}
      >
        {stopTime.stop.stop_name}
      </Link>{' '}
      at{' '}
      <PlainTimeElement
        time={stopTime.departureTime}
        approximate={!stopTime.timepoint}
        agencyTimezone={agency.agency_timezone}
      />
    </p>
  );
}
