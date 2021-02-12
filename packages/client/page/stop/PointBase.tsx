import {
  StreetViewPano,
  StreetViewStatic,
} from '@hawaii-bus-plus/react-google-maps';
import { ComponentChildren, h, Fragment } from 'preact';
import { useState } from 'preact/hooks';
import {
  googleMapsApiKey,
  useLoadGoogleMaps,
} from '../hooks/useLoadGoogleMaps';

interface Props {
  position?: google.maps.LatLngLiteral;
  children: ComponentChildren;
}

export function PointBase(props: Props) {
  const [status, setStatus] = useState<
    google.maps.StreetViewStatus | undefined
  >();
  const { loadError } = useLoadGoogleMaps();

  return (
    <>
      <div
        className="aspect-w-16 aspect-h-9 mb-4"
        hidden={status === 'ZERO_RESULTS'}
      >
        {props.position ? (
          loadError ? (
            <StreetViewStatic
              googleMapsApiKey={googleMapsApiKey}
              class="bg-very-dark"
              position={props.position}
            />
          ) : (
            <StreetViewPano
              class="bg-very-dark"
              position={props.position}
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
