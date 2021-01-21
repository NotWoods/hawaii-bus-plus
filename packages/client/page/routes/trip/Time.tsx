import React from 'react';
import { TimeString } from '@hawaii-bus-plus/types';
import { stringTime } from '@hawaii-bus-plus/utils';

interface TimeProps {
  time: TimeString;
  approximate?: boolean;
  className?: string;
}

export function Time(props: TimeProps) {
  return (
    <time dateTime={props.time} className={props.className}>
      {props.approximate ? '~' : ''}
      {stringTime(props.time)}
    </time>
  );
}
