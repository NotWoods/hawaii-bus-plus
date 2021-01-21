import React from 'react';
import { TimeString } from '../../../shared/data-types';
import { stringTime } from '../../../shared/utils/date';

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
