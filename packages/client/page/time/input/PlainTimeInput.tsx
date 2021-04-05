import { nowWithZone } from '@hawaii-bus-plus/temporal-utils';
import clsx, { ClassValue } from 'clsx';
import { h } from 'preact';
import { Temporal } from 'proposal-temporal';
import { NOW } from './symbol';

interface InputProps<T> {
  'aria-label'?: string;
  value: T | string | NOW;
  class?: ClassValue;
  onChange(time: T): void;
}

function PlainTimeInput(props: InputProps<Temporal.PlainTime>) {
  let value: Temporal.PlainTime;
  if (props.value === NOW) {
    value = nowWithZone('Pacific/Honolulu').toPlainTime();
  } else if (typeof props.value === 'string') {
    value = Temporal.PlainTime.from(props.value);
  } else {
    value = props.value;
  }
  return (
    <input
      type="time"
      class={clsx('border-current', props.class)}
      placeholder="12:00"
      aria-label={props['aria-label']}
      value={value.toString({ smallestUnit: 'minutes' })}
      onChange={(evt) =>
        props.onChange(
          Temporal.PlainTime.from(evt.currentTarget.value, {
            overflow: 'constrain',
          }),
        )
      }
    />
  );
}

export function PlainDateInput(props: InputProps<Temporal.PlainDate>) {
  let value: Temporal.PlainDate;
  if (props.value === NOW) {
    value = nowWithZone('Pacific/Honolulu').toPlainDate();
  } else if (typeof props.value === 'string') {
    value = Temporal.PlainDate.from(props.value);
  } else {
    value = props.value;
  }
  return (
    <input
      type="date"
      class={clsx('border-current', props.class)}
      placeholder="2021-01-31"
      aria-label={props['aria-label']}
      value={value.toString()}
      onChange={(evt) =>
        props.onChange(
          Temporal.PlainDate.from(evt.currentTarget.value, {
            overflow: 'constrain',
          }),
        )
      }
    />
  );
}

export function PlainDateTimeInput(props: InputProps<Temporal.PlainDateTime>) {
  let value: Temporal.PlainDateTime;
  if (props.value === NOW) {
    value = nowWithZone('Pacific/Honolulu');
  } else if (typeof props.value === 'string') {
    value = Temporal.PlainDateTime.from(props.value);
  } else {
    value = props.value;
  }
  return (
    <div class="flex gap-1 mt-1">
      <PlainTimeInput
        class={props.class}
        aria-label={props['aria-label']}
        value={value.toPlainTime()}
        onChange={(time) => props.onChange(value.withPlainTime(time))}
      />
      <PlainDateInput
        class={props.class}
        value={value.toPlainDate()}
        onChange={(date) => props.onChange(value.withPlainDate(date))}
      />
    </div>
  );
}
