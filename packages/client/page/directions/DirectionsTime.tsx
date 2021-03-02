import { h } from 'preact';
import type { Temporal } from 'proposal-temporal';
import { useLazyComponent } from '../hooks';
import { NOW } from '../time/input/symbol';

interface Props {
  /**
   * `undefined` means that "Leave now" is selected
   */
  value: Temporal.PlainDateTime | string | NOW | undefined;
  onChange(time: Temporal.PlainDateTime | NOW | undefined): void;
}

type Selected = 'now' | 'leave-at';

export function DirectionsTime(props: Props) {
  const { PlainDateTimeInput } = useLazyComponent(
    () => import('../routes/time-entry')
  );
  const selected = props.value != undefined ? 'leave-at' : 'now';

  return (
    <div class="bg-blue-900 p-4 my-2">
      <select
        class="border-current bg-blue-900 w-full"
        value={selected}
        onChange={(evt) => {
          const mode = evt.currentTarget.value as Selected;
          if (mode === 'now') {
            props.onChange(undefined);
          } else {
            props.onChange(NOW);
          }
        }}
      >
        <option value="now">Leave now</option>
        <option value="leave-at">Leave at</option>
      </select>
      {PlainDateTimeInput && selected === 'leave-at' ? (
        <PlainDateTimeInput
          class="text-xs bg-blue-900 flex-1"
          value={props.value!}
          onChange={(dateTime) => props.onChange(dateTime)}
        />
      ) : undefined}
    </div>
  );
}
