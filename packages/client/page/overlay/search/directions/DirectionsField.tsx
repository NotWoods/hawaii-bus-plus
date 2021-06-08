import { Point } from '@hawaii-bus-plus/presentation';
import clsx from 'clsx';
import { ComponentChildren, h, Ref } from 'preact';
import { useEffect, useState } from 'preact/hooks';
import stopIcon from '../../../icons/bus_stop.svg';
import locationIcon from '../../../icons/gps_fixed.svg';
import placeIcon from '../../../icons/place.svg';
import { LeadingInputIcon, SearchInput } from '../SearchInput';

interface Props {
  id: string;
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
  user: { src: locationIcon, alt: '' },
  stop: { src: stopIcon, alt: 'Bus stop' },
  place: { src: placeIcon, alt: 'Place' },
  marker: { src: placeIcon, alt: 'Marker' },
  bike: { src: placeIcon, alt: 'Bike station' },
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
          inputRef={props.inputRef}
          class={clsx({ 'pl-10': point, 'border-red-500': invalid })}
          aria-owns={props['aria-owns']}
          aria-expanded={props['aria-expanded'].toString()}
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
