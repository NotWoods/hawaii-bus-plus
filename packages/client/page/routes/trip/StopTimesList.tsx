import { StopTimeData } from '@hawaii-bus-plus/presentation';
import { Route, Stop } from '@hawaii-bus-plus/types';
import { lastIndex, skipUntil } from '@hawaii-bus-plus/utils';
import React from 'react';
import { classNames } from '../../hooks/classnames';
import { setStopAction } from '../../router/action';
import { Link } from '../../router/Router';
import { RouteBadges } from '../../stop/RouteBadge';
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
  stopTime: StopTimeData;
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
  return (
    <li className="d-block m-0">
      <Link
        action={setStopAction(stopTime.stop)}
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
          <RouteBadges omit={routeId} clear routeIds={stopTime.stop.routes} />
        </p>
        <Time
          time={stopTime.arrivalTime}
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
  stopTimes: readonly StopTimeData[];
  skipToStop?: Stop['stop_id'];
  timeZone?: string;
}

export function StopTimesList(props: StopTimeListProps) {
  // Skip until you reach the given stop
  let entries = props.stopTimes.entries();
  if (props.skipToStop) {
    entries = skipUntil(
      props.stopTimes.entries(),
      ([, stopTime]) => stopTime.stop.stop_id === props.skipToStop
    );
  }
  const keySoFar = new Map<Stop['stop_id'], number>();

  return (
    <ul>
      {Array.from(entries, ([i, stopTime]) => {
        const stopId = stopTime.stop.stop_id;
        const keySuffix = keySoFar.get(stopId) || 0;
        keySoFar.set(stopId, keySuffix + 1);

        return (
          <StopTimeItem
            key={`${stopId}${keySuffix}`}
            routeId={props.routeId}
            stopTime={stopTime}
            first={i === 0}
            last={i === lastIndex(props.stopTimes)}
            timeZone={props.timeZone}
          />
        );
      })}
    </ul>
  );
}
