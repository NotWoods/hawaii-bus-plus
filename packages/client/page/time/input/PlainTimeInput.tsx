import { nowWithZone } from '@hawaii-bus-plus/temporal-utils';
import { h } from 'preact';
import { useMemo } from 'preact/hooks';
import { Temporal } from '@js-temporal/polyfill';
import { NOW } from './symbol';

interface InputProps<T> {
  'aria-label'?: string;
  value: T | string | NOW;
  class?: string;
  onChange(time: T): void;
}

function PlainTimeInput(props: InputProps<Temporal.PlainTime>) {
  const value = useMemo(() => {
    if (props.value === NOW) {
      return nowWithZone('Pacific/Honolulu').toPlainTime();
    } else if (typeof props.value === 'string') {
      return Temporal.PlainTime.from(props.value);
    } else {
      return props.value;
    }
  }, [props.value]);

  return (
    <input
      type="time"
      class={props.class}
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
  const value = useMemo(() => {
    if (props.value === NOW) {
      return nowWithZone('Pacific/Honolulu').toPlainDate();
    } else if (typeof props.value === 'string') {
      return Temporal.PlainDate.from(props.value);
    } else {
      return props.value;
    }
  }, [props.value]);

  return (
    <input
      type="date"
      class={props.class}
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
  const value = useMemo(() => {
    if (props.value === NOW) {
      return nowWithZone('Pacific/Honolulu');
    } else if (typeof props.value === 'string') {
      return Temporal.PlainDateTime.from(props.value);
    } else {
      return props.value;
    }
  }, [props.value]);

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
