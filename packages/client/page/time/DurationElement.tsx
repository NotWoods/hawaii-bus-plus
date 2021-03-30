import {
  DurationData,
  formatRelativeDuration,
} from '@hawaii-bus-plus/presentation';
import clsx, { ClassValue } from 'clsx';
import { h } from 'preact';

interface Props {
  duration: DurationData;
  class?: ClassValue;
  style?: {
    [key: string]: string | number | null | undefined;
  };
}

export function DurationElement(props: Props) {
  const str = formatRelativeDuration(props.duration);

  return (
    <time
      class={clsx('whitespace-nowrap', props.class)}
      style={props.style}
      dateTime={props.duration.string}
    >
      {str}
    </time>
  );
}

export function RelativeDurationElement(props: Props) {
  const str = formatRelativeDuration(props.duration);

  return (
    <time
      class={clsx('whitespace-nowrap', props.class)}
      style={props.style}
      dateTime={props.duration.string}
    >
      {str ?? 'now'}
    </time>
  );
}
