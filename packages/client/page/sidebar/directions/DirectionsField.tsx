import React, { ReactNode, useState } from 'react';
import type { Point } from '../../../worker-nearby/directions';
import type { SearchResults } from '../../../worker-search/search';
import stopIcon from '../../icons/bus_stop.svg';
import locationIcon from '../../icons/gps_fixed.svg';
import { Icon } from '../../icons/Icon';
import placeIcon from '../../icons/place.svg';
import '../Sidebar.css';

interface Props {
  id: string;
  label: ReactNode;
  onChange(data: Point | undefined): void;
  onSearchResults?(results: SearchResults): void;
}

const icons = Object.freeze({
  user: { src: locationIcon, alt: '' },
  stop: { src: stopIcon, alt: 'Bus stop' },
  place: { src: placeIcon, alt: 'Place' },
  marker: { src: placeIcon, alt: 'Marker' },
});

export function DirectionsField(props: Props) {
  const [value, setValue] = useState('');
  const [data, setData] = useState<Point | undefined>();

  return (
    <div className="form-group mb-0">
      <label htmlFor={props.id}>{props.label}</label>
      <div className="input-group">
        {data ? (
          <div className="input-group-prepend">
            <span className="input-group-text">
              <Icon src={icons[data.type].src} alt={icons[data.type].alt} />
            </span>
          </div>
        ) : null}
        <input
          type="search"
          id={props.id}
          className="form-control"
          placeholder="Stop or location"
          value={data?.name || value}
          onChange={(evt) => {
            setValue(evt.currentTarget.value);
            setData(undefined);
            props.onChange(undefined);
          }}
        />
      </div>
    </div>
  );
}
