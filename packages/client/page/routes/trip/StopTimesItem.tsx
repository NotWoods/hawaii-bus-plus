import { StopTimeData } from '@hawaii-bus-plus/presentation';
import React from 'react';
import { classNames } from '../../hooks/classnames';
import { Link } from '../../router/Router';
import { RouteBadges } from '../../stop/RouteBadge';
import { ScheduleTime } from './ScheduleTime';
import './StopTimesItem.css';

function Lines() {
  return (
    <>
      <div className="lines__start" />
      <div className="lines__point">
        <div className="lines__dot" />
      </div>
      <div className="lines__end" />
    </>
  );
}

interface Props {
  stopTime: StopTimeData;
  timeZone: string;
  first?: boolean;
  last?: boolean;
}

/**
 * Represents a single stop time.
 * @param props.timeZone The agency timezone to display times in.
 * @param props.first True if this item is the first in a trip (not first in a list)
 * @param props.last True if this item is the last in a trip (not last in a list)
 */
export function StopTimeItem({ stopTime, first, last, timeZone }: Props) {
  return (
    <li className="d-block m-0">
      <Link
        href={`?stop=${stopTime.stop.stop_id}`}
        className={classNames(
          'sidebar-link sidebar-link-with-icon p-0 stoptime',
          first && 'stoptime--first',
          last && 'stoptime--last'
        )}
      >
        <Lines />
        <p className="stoptime-name m-0 d-block">
          {stopTime.stop.stop_name}
        </p>{' '}
        <p className="stoptime-desc m-0 font-size-12">
          {stopTime.stop.stop_desc}
        </p>
        <p className="stoptime-routes mb-0 font-size-12">
          <RouteBadges clear routes={stopTime.routes} />
        </p>
        <ScheduleTime
          time={stopTime.arrivalTime}
          approximate={!stopTime.timepoint}
          agencyTimezone={timeZone}
          className="stoptime-time text-nowrap text-right"
        />
      </Link>
    </li>
  );
}
