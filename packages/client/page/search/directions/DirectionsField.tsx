import { Point } from '@hawaii-bus-plus/presentation';
import { ComponentChildren, h } from 'preact';
import { useEffect, useState } from 'preact/hooks';
import { SearchResults } from '../../../worker-search/search-db';
import { classNames } from '../../hooks/classnames';
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

  useSearch(point ? '' : value, props.onSearchResults);

  return (
    <div className="mx-4 mb-2">
      <label class="block text-sm text-gray-50" htmlFor={id}>
        {props.label}
      </label>
      <div className="relative shadow-sm">
        <SearchInput
          id={id}
          class={classNames(point && 'pl-10', invalid && 'border-red-500')}
          placeholder="Stop or location"
          value={point?.name ?? value}
          onChange={(evt) => {
            setValue(evt.currentTarget.value);
            props.onChange(undefined);
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
