import { Point } from '@hawaii-bus-plus/presentation';
import clsx from 'clsx';
import type { ComponentChildren, Ref } from 'preact';
import { useEffect, useState } from 'preact/hooks';
import { bus_stop, gps_fixed, place } from '../../../../assets/icons/paths';
import { LeadingInputIcon, SearchInput } from '../SearchInput';

interface Props {
  id: string;
  autoFocus?: boolean;
  point?: Point;
  label: ComponentChildren;
  inputRef?: Ref<HTMLInputElement>;
  'aria-owns': string;
  'aria-expanded': boolean;
  onChange(data: Point | undefined): void;
  onSearch(value: string): void;
  onKeyDown?(event: KeyboardEvent): void;
}

const icons = Object.freeze({
  user: { src: gps_fixed, alt: '' },
  stop: { src: bus_stop, alt: 'Bus stop' },
  place: { src: place, alt: 'Place' },
  marker: { src: place, alt: 'Marker' },
  bike: { src: place, alt: 'Bike station' },
});

export function DirectionsField(props: Props) {
  const { point, id } = props;
  const [value, setValue] = useState('');
  const [edited, setEdited] = useState(false);
  const invalid = !point && edited;

  useEffect(() => {
    if (point) {
      setValue(point.name ?? '');
    }
  }, [point]);

  return (
    <div class="mx-4 mb-2">
      <label class="block text-sm text-gray-50" htmlFor={id}>
        {props.label}
      </label>
      <div class="relative shadow-sm">
        <SearchInput
          id={id}
          autoFocus={props.autoFocus}
          inputRef={props.inputRef}
          class={clsx({ 'pl-10': point, 'border-red-500': invalid })}
          aria-owns={props['aria-owns']}
          aria-expanded={props['aria-expanded']}
          placeholder="Stop or location"
          value={point?.name ?? value}
          onKeyDown={props.onKeyDown}
          onInput={(evt) => {
            const newValue = evt.currentTarget.value;
            setValue(newValue);
            props.onChange(undefined);
            props.onSearch(newValue);
          }}
          onFocus={() => {
            if (value && !point) {
              props.onSearch(value);
            }
          }}
          onBlur={() => setEdited(true)}
        />
        {point ? (
          <LeadingInputIcon
            src={icons[point.type].src}
            alt={icons[point.type].alt}
          />
        ) : null}
      </div>
    </div>
  );
}
