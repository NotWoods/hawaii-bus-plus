import React from 'react';
import { Route, StopTime } from '../../../shared/gtfs-types';
import { useApi } from '../../data/Api';
import { setStopAction } from '../../router/action';
import { Link } from '../../router/Router';
import { BLANK, RouteBadges } from '../../stop/RouteBadge';
import './StopTimesList.css';
import { Time } from './Time';

function Lines() {
  return (
    <div className="lines">
      <span className="lines__dot" />
    </div>
  );
}

interface StopTimeItemProps {
  routeId: Route['route_id'];
  stopTime: StopTime;
}

function StopTimeItem({ routeId, stopTime }: StopTimeItemProps) {
  const api = useApi();
  const stop = api?.stops?.[stopTime.stop_id];

  return (
    <li className="d-block m-0">
      <Link
        action={stop ? setStopAction(stop) : undefined}
        href={`?stop=${stopTime.stop_id}`}
        className="sidebar-link sidebar-link-with-icon p-0 stoptime"
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
          className="stoptime-time"
        />
      </Link>
    </li>
  );
}

interface StopTimeListProps {
  routeId: Route['route_id'];
  stopTimes: readonly StopTime[];
}

export function StopTimesList(props: StopTimeListProps) {
  return (
    <ul className="">
      {props.stopTimes.map((stopTime) => (
        <StopTimeItem
          key={stopTime.stop_id + stopTime.stop_sequence}
          routeId={props.routeId}
          stopTime={stopTime}
        />
      ))}
    </ul>
  );
}
