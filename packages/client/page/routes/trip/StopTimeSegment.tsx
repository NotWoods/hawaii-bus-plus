import { PlainTimeData } from '@hawaii-bus-plus/presentation';
import { Route } from '@hawaii-bus-plus/types';
import { ComponentChild, h, Fragment } from 'preact';
import { classNames } from '../../hooks/classnames';
import { Link } from '../../router/Router';
import { RouteBadges } from '../badge/RouteBadge';
import { ScheduleTime } from './ScheduleTime';
import './StopTimesItem.css';

interface DecorLinesProps {
  showDot?: boolean;
}

export function StopTimeDecorLines({ showDot = true }: DecorLinesProps) {
  return (
    <>
      <div className="lines__start" />
      <div className="lines__point">
        <div className={classNames('lines__dot', !showDot && 'd-none')} />
      </div>
      <div className="lines__end" />
    </>
  );
}

interface Props {
  href?: string;
  className?: string;

  name?: string;
  description?: string;

  routes?: readonly Route[];

  time?: {
    arrivalTime: PlainTimeData;
    departureTime: PlainTimeData;
    timeZone: string;
    timepoint: boolean;
  };

  first?: boolean;
  last?: boolean;
  small?: boolean;
}

/**
 * Represents a single stop time.
 * @param props.timeZone The agency timezone to display times in.
 * @param props.first True if this item is the first in a trip (not first in a list)
 * @param props.last True if this item is the last in a trip (not last in a list)
 */
export function StopTimeSegment(props: Props) {
  const { name, description, routes, first, last, time } = props;

  const stopNotes: ComponentChild[] = [];
  if (name) {
    stopNotes.push(
      <p
        key="name"
        className={classNames(
          'stoptime-name m-0 d-block',
          props.small && 'font-size-12'
        )}
      >
        {name}
      </p>
    );
    if (description) {
      stopNotes.push(' ');
      stopNotes.push(
        <p key="desc" className="stoptime-desc m-0 font-size-12">
          {description}
        </p>
      );
    }
  }

  const linkClasses = classNames(
    'sidebar-link sidebar-link-with-icon p-0 stoptime',
    props.className,
    first && 'stoptime--first',
    last && 'stoptime--last',
    props.small && 'stoptime--small'
  );

  const inner = (
    <>
      <StopTimeDecorLines />
      {stopNotes}
      {routes && routes.length > 0 && (
        <p className="stoptime-routes mb-0 font-size-12">
          <RouteBadges clear routes={routes} />
        </p>
      )}
      {time && (
        <ScheduleTime
          time={time.arrivalTime}
          approximate={!time.timepoint}
          agencyTimezone={time.timeZone}
          className="stoptime-time text-nowrap text-right"
        />
      )}
    </>
  );

  return (
    <li className="d-block m-0">
      {props.href ? (
        <Link href={props.href} className={linkClasses}>
          {inner}
        </Link>
      ) : (
        <div className={linkClasses}>{inner}</div>
      )}
    </li>
  );
}
