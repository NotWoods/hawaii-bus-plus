import { h } from 'preact';
import { Temporal } from 'proposal-temporal';
import { PlainDateTimeInput } from '../time/input/PlainTimeInput';

interface Props {
  now: Temporal.PlainDateTime;
  value: Temporal.PlainDateTime;
  onChange(time: Temporal.PlainDateTime): void;
}

export function DirectionsTime(props: Props) {
  const leaveNow = props.now.equals(props.value);
  return (
    <div className="directions-box bg-light bg-very-dark-dm">
      <select
        className="form-control form-control-sm"
        value={leaveNow ? 'now' : 'leave-at'}
        onChange={(evt) => {
          const mode = evt.currentTarget.value;
          if (mode === 'now') {
            props.onChange(props.now);
          }
        }}
      >
        <option value="now">Leave now</option>
        <option value="leave-at">Leave at</option>
      </select>
      {!leaveNow ? (
        <PlainDateTimeInput
          value={props.value}
          onChange={(dateTime) => props.onChange(dateTime)}
        />
      ) : undefined}
    </div>
  );
}
