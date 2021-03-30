import { formatPlainTime, PlainTimeData } from '@hawaii-bus-plus/presentation';
import clsx, { ClassValue } from 'clsx';
import { h } from 'preact';

interface Props {
  time: PlainTimeData;
  approximate?: boolean;
  class?: ClassValue;
  style?: {
    [key: string]: string | number | null | undefined;
  };
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
export function PlainTimeElement(props: Props) {
  const prefix = props.approximate ? '~' : '';
  const { localTime, agencyTime } = formatPlainTime(
    props.time,
    props.agencyTimezone
  );

  return (
    <time
      class={clsx('whitespace-nowrap', props.class)}
      style={props.style}
      dateTime={props.time.string}
      title={`${prefix}${localTime}`}
    >
      {prefix}
      {agencyTime}
    </time>
  );
}
