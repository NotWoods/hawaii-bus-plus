import { Point } from '@hawaii-bus-plus/presentation';
import clsx from 'clsx';
import { ComponentChildren, h } from 'preact';
import { useEffect, useRef, useState } from 'preact/hooks';
import type { SearchResults } from '../../../../worker-search/search-db';
import stopIcon from '../../icons/bus_stop.svg';
import locationIcon from '../../icons/gps_fixed.svg';
import placeIcon from '../../icons/place.svg';
import { LeadingInputIcon, SearchInput } from '../SearchInput';
import { useSearch } from '../simple/useSearch';

interface Props {
  id: string;
  point?: Point;
  label: ComponentChildren;
  onChange(data: Point | undefined): void;
  onSearchResults(results: SearchResults): void;
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
  const aborter = useRef<AbortController>();
  const [value, setValue] = useState('');
  const [edited, setEdited] = useState(false);
  const getSearchResults = useSearch();
  const invalid = !point && edited;

  useEffect(() => {
    aborter.current = new AbortController();
    return () => aborter.current?.abort();
  }, []);

  useEffect(() => {
    if (point) {
      setValue(point.name ?? '');
    }
  }, [point]);

  async function performSearch(value: string) {
    const results = await getSearchResults(value, aborter.current.signal);
    props.onSearchResults(results);
  }

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
          onInput={async (evt) => {
            const newValue = evt.currentTarget.value;
            setValue(newValue);
            props.onChange(undefined);
            await performSearch(newValue);
          }}
          onFocus={async () => {
            if (value && !point) {
              await performSearch(value);
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
