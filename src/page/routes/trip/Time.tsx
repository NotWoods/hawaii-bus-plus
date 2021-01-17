import React from 'react';
import { stringTime } from '../../../shared/utils/date';

interface TimeProps {
  time: string;
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
