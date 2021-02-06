import { Point } from '@hawaii-bus-plus/presentation';
import { ComponentChildren, h } from 'preact';
import { useEffect, useState } from 'preact/hooks';
import { SearchResults } from '../../../worker-search/search-db';
import { classNames } from '../../hooks/classnames';
import stopIcon from '../../icons/bus_stop.svg';
import locationIcon from '../../icons/gps_fixed.svg';
import { Icon } from '../../icons/Icon';
import placeIcon from '../../icons/place.svg';
import { useSearch } from '../search/SidebarSearch';
import '../Sidebar.css';

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
  const [value, setValue] = useState('');
  const [edited, setEdited] = useState(false);
  const invalid = !props.point && edited;

  useEffect(() => {
    if (props.point) {
      setValue(props.point.name ?? '');
    }
  }, [props.point]);

  useSearch(props.point ? '' : value, props.onSearchResults);

  return (
    <div className={classNames('form-group mb-0', invalid && 'is-invalid')}>
      <label htmlFor={props.id}>{props.label}</label>
      <div className="input-group">
        {props.point ? (
          <div className="input-group-prepend">
            <span className="input-group-text">
              <Icon
                src={icons[props.point.type].src}
                alt={icons[props.point.type].alt}
              />
            </span>
          </div>
        ) : null}
        <input
          type="search"
          id={props.id}
          className="form-control"
          placeholder="Stop or location"
          value={props.point?.name ?? value}
          onChange={(evt) => {
            setValue(evt.currentTarget.value);
            props.onChange(undefined);
          }}
          onBlur={() => setEdited(true)}
        />
      </div>
    </div>
  );
}
