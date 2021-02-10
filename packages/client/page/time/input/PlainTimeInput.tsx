import { h } from 'preact';
import { Temporal } from 'proposal-temporal';

interface InputProps<T> {
  'aria-label'?: string;
  value: T;
  forceDark?: boolean;
  onChange(time: T): void;
}

function PlainTimeInput(props: InputProps<Temporal.PlainTime>) {
  return (
    <input
      type="time"
      class={props.forceDark ? 'bg-gray-800' : 'dark:bg-gray-800'}
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
      class={props.forceDark ? 'bg-gray-800' : 'dark:bg-gray-800'}
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
    <div className="">
      <div className="">
        <PlainTimeInput
          forceDark={props.forceDark}
          aria-label={props['aria-label']}
          value={props.value.toPlainTime()}
          onChange={(time) => props.onChange(props.value.withPlainTime(time))}
        />
      </div>
      <div className="">
        <PlainDateInput
          forceDark={props.forceDark}
          value={props.value.toPlainDate()}
          onChange={(date) => props.onChange(props.value.withPlainDate(date))}
        />
      </div>
    </div>
  );
}
