import {
  StreetViewPano,
  StreetViewPanoProps
} from '@hawaii-bus-plus/react-google-maps';
import { ComponentChildren, h } from 'preact';
import { useState } from 'preact/hooks';

interface Props extends Omit<StreetViewPanoProps, 'googleMapsApiKey'> {
  children?: ComponentChildren;
}

export function StreetViewCard(props: Props) {
  const [status, setStatus] = useState<
    google.maps.StreetViewStatus | undefined
  >();

  return (
    <div className="w-400 absolute top-0 right-0">
      <aside className="m-8 p-0 shadow-lg bg-gray-50 dark:bg-gray-800 text-black dark:text-white" hidden={!props.visible}>
        <div
          className="aspect-w-16 aspect-h-9"
          hidden={status === 'ZERO_RESULTS'}
        >
          <StreetViewPano
            googleMapsApiKey={import.meta.env.VITE_GOOGLE_MAPS_KEY as string}
            className="bg-very-dark rounded-t"
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
