import React from 'react';
import './PlaceCard.css';
import { StreetViewPano, StreetViewPanoProps } from './StreetViewPano';

interface Props extends StreetViewPanoProps {
  title?: string;
  subtitle?: string;
}

export function PlaceCard(props: Props) {
  return (
    <div className="w-400">
      <aside className="card p-0 shadow" hidden={!props.visible}>
        <div className="aspect-ratio-container">
          <StreetViewPano
            className="bg-very-dark aspect-ratio rounded-top"
            position={props.position}
            visible={props.visible}
            onClose={props.onClose}
          >
            <img className="rounded-top" alt="Street view" />
          </StreetViewPano>
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
