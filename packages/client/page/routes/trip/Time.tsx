import { Temporal } from 'proposal-temporal';
import React from 'react';

interface TimeProps {
  time: Temporal.ZonedDateTime;
  approximate?: boolean;
  className?: string;
  timeZone?: string;
}

declare global {
  namespace Intl {
    interface DateTimeFormatOptions {
      timeStyle?: string;
    }
  }
}

export function Time(props: TimeProps) {
  const date = new Date(props.time.epochMilliseconds);
  const formatter = new Intl.DateTimeFormat(undefined, {
    timeStyle: 'short',
    timeZone: props.timeZone,
  });
  return (
    <time
      dateTime={props.time.toPlainTime().toString()}
      className={props.className}
    >
      {props.approximate ? '~' : ''}
      {formatter.format(date)}
    </time>
  );
}
