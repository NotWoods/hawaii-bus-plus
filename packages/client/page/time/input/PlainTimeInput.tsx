import { h } from 'preact';
import { Temporal } from 'proposal-temporal';
import { classNames } from '../../hooks/classnames';

interface InputProps<T> {
  'aria-label'?: string;
  value: T;
  class?: string;
  onChange(time: T): void;
}

function PlainTimeInput(props: InputProps<Temporal.PlainTime>) {
  return (
    <input
      type="time"
      class={classNames('border-current', props.class)}
      placeholder="12:00"
      aria-label={props['aria-label']}
      value={props.value.toString({ smallestUnit: 'minutes' })}
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
  return (
    <input
      type="date"
      class={classNames('border-current', props.class)}
      placeholder="2021-01-31"
      aria-label={props['aria-label']}
      value={props.value.toString()}
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
  return (
    <div class="flex gap-1 mt-1">
      <PlainTimeInput
        class={props.class}
        aria-label={props['aria-label']}
        value={props.value.toPlainTime()}
        onChange={(time) => props.onChange(props.value.withPlainTime(time))}
      />
      <PlainDateInput
        class={props.class}
        value={props.value.toPlainDate()}
        onChange={(date) => props.onChange(props.value.withPlainDate(date))}
      />
    </div>
  );
}
