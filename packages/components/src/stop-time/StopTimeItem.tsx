import { StopTimeData } from '@hawaii-bus-plus/presentation';
import { Stop } from '@hawaii-bus-plus/types';
import React from 'react';
import { classNames } from '../hooks/classnames';
import { Link } from '../link/Link';
import { RouteBadges } from '../stop/RouteBadge';
import { ScheduleTime } from './ScheduleTime';
import './StopTimeItem.css';

export function StopTimeLineDecor() {
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

interface Props extends Partial<Omit<StopTimeData, 'stop'>> {
  stopId: Stop['stop_id'];
  stop: Partial<Pick<Stop, 'stop_name' | 'stop_desc'>>;
  agencyTimezone: string;

  first?: boolean;
  last?: boolean;
}

/**
 * Represents a single stop time.
 * @param props.stop.stop_name Name of the stop. Omit to hide.
 * @param props.stop.stop_desc Description of the stop. Omit to hide.
 * @param props.routes Routes the stop connects to which should be shown as badges. Omit to hide.
 * @param props.timeZone The agency timezone to display times in.
 * @param props.first True if this item is the first in a trip (not first in a list)
 * @param props.last True if this item is the last in a trip (not last in a list)
 */
export function StopTimeItem(props: Props) {
  const { stop } = props;

  return (
    <li className="d-block m-0">
      <Link
        href={`?stop=${props.stopId}`}
        className={classNames(
          'sidebar-link sidebar-link-with-icon p-0 stoptime',
          props.first && 'stoptime--first',
          props.last && 'stoptime--last'
        )}
      >
        <StopTimeLineDecor />
        {stop.stop_name && (
          <p className="stoptime-name m-0 d-block">{stop.stop_name}</p>
        )}
        {stop.stop_desc && ' '}
        {stop.stop_desc && (
          <p className="stoptime-desc m-0 font-size-12">{stop.stop_desc}</p>
        )}
        {props.routes && (
          <p className="stoptime-routes mb-0 font-size-12">
            <RouteBadges clear routes={props.routes} />
          </p>
        )}
        {props.arrivalTime && props.departureTime && (
          <ScheduleTime
            time={props.arrivalTime}
            approximate={!props.timepoint}
            agencyTimezone={props.agencyTimezone}
            className="stoptime-time text-nowrap text-right"
          />
        )}
      </Link>
    </li>
  );
}

export function StopTimeBusDecor() {
  return (
    <li className="d-block m-0">
      <span className="sidebar-link sidebar-link-with-icon p-0 stoptime">
        <StopTimeLineDecor />
      </span>
    </li>
  );
}
