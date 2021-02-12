import { nowWithZone } from '@hawaii-bus-plus/utils';
import { h } from 'preact';
import { Temporal } from 'proposal-temporal';
import { classNames } from '../../hooks/classnames';
import { NOW } from './symbol';

interface InputProps<T> {
  'aria-label'?: string;
  value: T | NOW;
  class?: string;
  onChange(time: T): void;
}

function PlainTimeInput(props: InputProps<Temporal.PlainTime>) {
  const value =
    props.value === NOW
      ? nowWithZone('Pacific/Honolulu').toPlainTime()
      : props.value;
  return (
    <input
      type="time"
      class={classNames('border-current', props.class)}
      placeholder="12:00"
      aria-label={props['aria-label']}
      value={value.toString({ smallestUnit: 'minutes' })}
      onChange={(evt) =>
        props.onChange(
          Temporal.PlainTime.from(evt.currentTarget.value, {
            overflow: 'constrain',
          })
        )
      }
    />
  );
}

export function PlainDateInput(props: InputProps<Temporal.PlainDate>) {
  const value =
    props.value === NOW
      ? nowWithZone('Pacific/Honolulu').toPlainDate()
      : props.value;
  return (
    <input
      type="date"
      class={classNames('border-current', props.class)}
      placeholder="2021-01-31"
      aria-label={props['aria-label']}
      value={value.toString()}
      onChange={(evt) =>
        props.onChange(
          Temporal.PlainDate.from(evt.currentTarget.value, {
            overflow: 'constrain',
          })
        )
      }
    />
  );
}

export function PlainDateTimeInput(props: InputProps<Temporal.PlainDateTime>) {
  const value =
    props.value === NOW ? nowWithZone('Pacific/Honolulu') : props.value;
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
