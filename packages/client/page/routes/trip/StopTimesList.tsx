import { Route, Stop } from '@hawaii-bus-plus/types';
import React, { ReactNode } from 'react';
import { TemporalStopTime } from '../../../worker-info/route-details';
import { useApi } from '../../data/Api';
import { classNames } from '../../hooks/classnames';
import { setStopAction } from '../../router/action';
import { Link } from '../../router/Router';
import { BLANK, RouteBadges } from '../../stop/RouteBadge';
import './StopTimesList.css';
import { Time } from './Time';

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

interface StopTimeItemProps {
  routeId: Route['route_id'];
  stopTime: TemporalStopTime;
  first?: boolean;
  last?: boolean;
  timeZone?: string;
}

function StopTimeItem({
  routeId,
  stopTime,
  first,
  last,
  timeZone,
}: StopTimeItemProps) {
  const api = useApi();
  const stop = api?.stops?.[stopTime.stop_id];

  return (
    <li className="d-block m-0">
      <Link
        action={stop ? setStopAction(stop) : undefined}
        href={`?stop=${stopTime.stop_id}`}
        className={classNames(
          'sidebar-link sidebar-link-with-icon p-0 stoptime',
          first && 'stoptime--first',
          last && 'stoptime--last'
        )}
      >
        <Lines />
        <p className="stoptime-name m-0 d-block">
          {stop?.stop_name || BLANK}
        </p>{' '}
        <p className="stoptime-desc m-0 font-size-12">{stop?.stop_desc}</p>
        <p className="stoptime-routes mb-0 font-size-12">
          <RouteBadges omit={routeId} clear routeIds={stop?.routes || []} />
        </p>
        <Time
          time={stopTime.arrival_time}
          approximate={!stopTime.timepoint}
          timeZone={timeZone}
          className="stoptime-time text-nowrap text-right"
        />
      </Link>
    </li>
  );
}

interface StopTimeListProps {
  routeId: Route['route_id'];
  stopTimes: readonly TemporalStopTime[];
  skipToStop?: Stop['stop_id'];
  timeZone?: string;
}

export function StopTimesList(props: StopTimeListProps) {
  const lastIndex = props.stopTimes.length - 1;
  const children: ReactNode[] = [];
  let skipDone = !props.skipToStop;

  for (const [i, stopTime] of props.stopTimes.entries()) {
    // Skip until you reach the given stop
    skipDone ||= stopTime.stop_id === props.skipToStop;
    if (skipDone) {
      children.push(
        <StopTimeItem
          key={stopTime.stop_id + stopTime.stop_sequence}
          routeId={props.routeId}
          stopTime={stopTime}
          first={i === 0}
          last={i === lastIndex}
          timeZone={props.timeZone}
        />
      );
    }
  }

  return <ul>{children}</ul>;
}
