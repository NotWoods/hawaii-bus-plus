import React, { ReactNode, useState } from 'react';
import {
  StreetViewPano,
  StreetViewPanoProps,
} from '@hawaii-bus-plus/react-google-maps';
import './StreetViewCard.css';

interface Props extends StreetViewPanoProps {
  children?: ReactNode;
}

export function StreetViewCard(props: Props) {
  const [status, setStatus] = useState<
    google.maps.StreetViewStatus | undefined
  >();

  return (
    <div className="w-400 position-absolute top-0 right-0">
      <aside className="card p-0 shadow" hidden={!props.visible}>
        <div
          className="aspect-ratio-container"
          hidden={status === 'ZERO_RESULTS'}
        >
          <StreetViewPano
            className="bg-very-dark aspect-ratio rounded-top"
            position={props.position}
            visible={props.visible}
            onClose={props.onClose}
            onStatusChange={function () {
              setStatus(this.getStatus());
            }}
          />
        </div>
        {props.children}
      </aside>
    </div>
  );
}
