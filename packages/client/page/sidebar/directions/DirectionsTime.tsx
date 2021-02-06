import { Temporal } from 'proposal-temporal';
import { h } from 'preact';
import { useState } from 'preact/hooks';
import '../Sidebar.css';

interface InputProps<T> {
  'aria-label'?: string;
  value: T;
  onChange(time: T): void;
}

function PlainTimeInput(props: InputProps<Temporal.PlainTime>) {
  return (
    <input
      type="time"
      className="form-control form-control-sm"
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
      className="form-control form-control-sm"
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
    <div className="form-row row-eq-spacing">
      <div className="col">
        <PlainTimeInput
          aria-label={props['aria-label']}
          value={props.value.toPlainTime()}
          onChange={(time) => props.onChange(props.value.withPlainTime(time))}
        />
      </div>
      <div className="col">
        <PlainDateInput
          value={props.value.toPlainDate()}
          onChange={(date) => props.onChange(props.value.withPlainDate(date))}
        />
      </div>
    </div>
  );
}

export function DirectionsTime(
  props: Pick<InputProps<Temporal.PlainDateTime>, 'onChange'>
) {
  const [mode, setMode] = useState('now');
  const [dateTime, setDateTime] = useState(() =>
    Temporal.now.plainDateTimeISO()
  );

  return (
    <div className="directions-box bg-light bg-very-dark-dm">
      <select
        className="form-control form-control-sm"
        value={mode}
        onChange={(evt) => {
          const mode = evt.currentTarget.value;
          setMode(mode);
          if (mode === 'now') {
            props.onChange(Temporal.now.plainDateTimeISO());
          }
        }}
      >
        <option value="now">Leave now</option>
        <option value="leave-at">Leave at</option>
      </select>
      {mode === 'leave-at' ? (
        <PlainDateTimeInput
          value={dateTime}
          onChange={(dateTime) => {
            setDateTime(dateTime);
            props.onChange(dateTime);
          }}
        />
      ) : undefined}
    </div>
  );
}
