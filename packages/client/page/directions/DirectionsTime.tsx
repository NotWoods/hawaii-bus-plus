import { h } from 'preact';
import { useState } from 'preact/hooks';
import type { Temporal } from 'proposal-temporal';
import { useLazyComponent } from '../hooks/useLazyComponent';

interface Props {
  now: Temporal.PlainDateTime;
  value: Temporal.PlainDateTime;
  onChange(time: Temporal.PlainDateTime): void;
}

type Selected = 'now' | 'leave-at';

export function DirectionsTime(props: Props) {
  const { PlainDateTimeInput } = useLazyComponent(
    () => import('../time/input/PlainTimeInput')
  );
  const [selected, setSelected] = useState<Selected>(
    props.now.equals(props.value) ? 'now' : 'leave-at'
  );

  return (
    <div class="bg-blue-900 p-4 mt-2">
      <select
        class="border-current bg-blue-900 w-full"
        value={selected}
        onChange={(evt) => {
          const mode = evt.currentTarget.value as Selected;
          setSelected(mode);
          if (mode === 'now') {
            props.onChange(props.now);
          }
        }}
      >
        <option value="now">Leave now</option>
        <option value="leave-at">Leave at</option>
      </select>
      {PlainDateTimeInput && selected === 'leave-at' ? (
        <PlainDateTimeInput
          class="text-xs bg-blue-900 flex-1"
          value={props.value}
          onChange={(dateTime) => props.onChange(dateTime)}
        />
      ) : undefined}
    </div>
  );
}
