import { Point } from '@hawaii-bus-plus/presentation';
import clsx from 'clsx';
import { ComponentChildren, h } from 'preact';
import { useEffect, useState } from 'preact/hooks';
import stopIcon from '../../../icons/bus_stop.svg';
import locationIcon from '../../../icons/gps_fixed.svg';
import placeIcon from '../../../icons/place.svg';
import { LeadingInputIcon, SearchInput } from '../SearchInput';

interface Props {
  id: string;
  point?: Point;
  label: ComponentChildren;
  onChange(data: Point | undefined): void;
  onSearch(value: string): void;
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
    <div className="mx-4 mb-2">
      <label class="block text-sm text-gray-50" htmlFor={id}>
        {props.label}
      </label>
      <div className="relative shadow-sm">
        <SearchInput
          id={id}
          class={clsx({ 'pl-10': point, 'border-red-500': invalid })}
          placeholder="Stop or location"
          value={point?.name ?? value}
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
