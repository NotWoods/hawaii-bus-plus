import React from 'react';

interface TimeProps {
  time: { epochMilliseconds: number; string: string };
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

const localTimeLongFormatter = new Intl.DateTimeFormat(undefined, {
  timeStyle: 'long',
});

export function Time(props: TimeProps) {
  const date = new Date(props.time.epochMilliseconds);
  const agencyTimeFormatter = new Intl.DateTimeFormat(undefined, {
    timeStyle: 'short',
    timeZone: props.timeZone,
  });
  const agencyTime = agencyTimeFormatter.format(date);

  const prefix = props.approximate ? '~' : '';

  return (
    <time
      dateTime={props.time.string}
      className={props.className}
      title={`${prefix}${localTimeLongFormatter.format(date)}`}
    >
      {prefix}
      {agencyTime}
    </time>
  );
}
