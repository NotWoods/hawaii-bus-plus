import {
  StreetViewPano,
  StreetViewStatic,
} from '@hawaii-bus-plus/react-google-maps';
import type { ComponentChildren } from 'preact';
import { useState } from 'preact/hooks';
import type { LatLngLiteral } from 'spherical-geometry-js';
import { GOOGLE_MAPS_KEY } from '../../../services/env';
import { useLoadGoogleMaps } from '../../hooks/useLoadGoogleMaps';

interface Props {
  position?: LatLngLiteral;
  children: ComponentChildren;
}

const pov: Required<google.maps.StreetViewPov> = { heading: 34, pitch: 0 };

export function PointBase(props: Props) {
  const { position } = props;
  const [status, setStatus] = useState<
    google.maps.StreetViewStatus | undefined
  >();
  const { loadError } = useLoadGoogleMaps();

  return (
    <>
      <div
        className="aspect-video mb-4 bg-black"
        hidden={
          status ===
          ('ZERO_RESULTS' as google.maps.StreetViewStatus.ZERO_RESULTS)
        }
      >
        {position ? (
          loadError ? (
            <StreetViewStatic
              googleMapsApiKey={GOOGLE_MAPS_KEY}
              size="474x266"
              class="bg-very-dark"
              position={position}
              pov={pov}
            />
          ) : (
            <StreetViewPano
              class="bg-very-dark"
              position={position}
              pov={pov}
              onStatusChange={function () {
                setStatus(this.getStatus());
              }}
            />
          )
        ) : null}
      </div>
      {props.children}
    </>
  );
}
