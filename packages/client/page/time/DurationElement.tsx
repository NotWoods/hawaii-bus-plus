import { DurationData, formatDuration } from '@hawaii-bus-plus/presentation';
import { h } from 'preact';

interface Props {
  duration: DurationData;
  class?: string;
  style?: {
    [key: string]: string | number | null | undefined;
  };
}

export function DurationElement(props: Props) {
  const str = formatDuration(props.duration);

  return (
    <time
      class={props.class}
      style={props.style}
      dateTime={props.duration.string}
    >
      {str}
    </time>
  );
}

export function RelativeDurationElement(props: Props) {
  const str = formatDuration(props.duration);

  return (
    <time
      class={props.class}
      style={props.style}
      dateTime={props.duration.string}
    >
      {str ?? 'now'}
    </time>
  );
}
