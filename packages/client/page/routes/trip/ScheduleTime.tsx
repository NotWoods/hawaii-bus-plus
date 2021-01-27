import { formatPlainTime, PlainTimeData } from '@hawaii-bus-plus/presentation';
import React from 'react';

interface Props {
  time: PlainTimeData;
  approximate?: boolean;
  className?: string;
  agencyTimezone: string;
}

/**
 * Displays an schedule time, which corresponds to a Temporal.PlainTime with days.
 * Shows time in the agency's timezone by default.
 * On hover, the time in the user's local timezone is displayed.
 *
 * @param props.time Data representing a plain time.
 * @param props.approximate
 */
export function ScheduleTime(props: Props) {
  const prefix = props.approximate ? '~' : '';
  const { localTime, agencyTime } = formatPlainTime(
    props.time,
    props.agencyTimezone
  );

  return (
    <time
      className={props.className}
      dateTime={props.time.string}
      title={`${prefix}${localTime}`}
    >
      {prefix}
      {agencyTime}
    </time>
  );
}
