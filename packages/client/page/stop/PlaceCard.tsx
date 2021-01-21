import React, { ReactNode } from 'react';
import {
  StreetViewPano,
  StreetViewPanoProps,
} from '@hawaii-bus-plus/react-google-maps';
import './PlaceCard.css';

interface Props extends StreetViewPanoProps {
  children?: ReactNode;
}

export function PlaceCard(props: Props) {
  return (
    <div className="w-400 position-absolute top-0 right-0">
      <aside className="card p-0 shadow" hidden={!props.visible}>
        <div className="aspect-ratio-container">
          <StreetViewPano
            className="bg-very-dark aspect-ratio rounded-top"
            position={props.position}
            visible={props.visible}
            onClose={props.onClose}
          />
        </div>
        {props.children}
      </aside>
    </div>
  );
}
