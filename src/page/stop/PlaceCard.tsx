import React, { ReactNode } from 'react';
import './PlaceCard.css';
import { StreetViewPano, StreetViewPanoProps } from './StreetViewPano';

interface Props extends StreetViewPanoProps {
  children?: ReactNode;
  title?: string;
  subtitle?: string;
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
        <div className="content">
          <h2 className="card-title m-0">{props.title}</h2>
          {props.subtitle ? (
            <p className="text-muted m-0">{props.subtitle}</p>
          ) : null}
        </div>
        {props.children}
      </aside>
    </div>
  );
}
