import {
  DurationData,
  formatRelativeDuration,
} from '@hawaii-bus-plus/presentation';
import { h } from 'preact';
import { classNames } from '../hooks/classnames';

interface Props {
  duration: DurationData;
  class?: string;
  style?: {
    [key: string]: string | number | null | undefined;
  };
}

export function DurationElement(props: Props) {
  const str = formatRelativeDuration(props.duration);

  return (
    <time
      class={classNames('whitespace-nowrap', props.class)}
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
      class={classNames('whitespace-nowrap', props.class)}
      style={props.style}
      dateTime={props.duration.string}
    >
      {str ?? 'now'}
    </time>
  );
}
