import { h } from 'preact';
import { Temporal } from 'proposal-temporal';

interface InputProps<T> {
  'aria-label'?: string;
  value: T;
  onChange(time: T): void;
}

function PlainTimeInput(props: InputProps<Temporal.PlainTime>) {
  return (
    <input
      type="time"
      className="bg-transparent"
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
      className="bg-transparent"
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
          aria-label={props['aria-label']}
          value={props.value.toPlainTime()}
          onChange={(time) => props.onChange(props.value.withPlainTime(time))}
        />
      </div>
      <div className="">
        <PlainDateInput
          value={props.value.toPlainDate()}
          onChange={(date) => props.onChange(props.value.withPlainDate(date))}
        />
      </div>
    </div>
  );
}
