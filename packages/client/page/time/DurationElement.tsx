import {
  DurationData,
  formatRelativeDuration,
} from '@hawaii-bus-plus/presentation';
import clsx from 'clsx';
import type { JSX } from 'preact';

interface Props
  extends Pick<JSX.HTMLAttributes<HTMLTimeElement>, 'class' | 'style'> {
  duration: DurationData;
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
