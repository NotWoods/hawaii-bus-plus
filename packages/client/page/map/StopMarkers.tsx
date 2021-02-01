import { Marker } from '@hawaii-bus-plus/react-google-maps';
import { Stop } from '@hawaii-bus-plus/types';
import { h, Fragment } from 'preact';
import { useContext } from 'preact/hooks';
import { useApi } from '../hooks/useApi';
import { useMarkerIcon } from '../hooks/useMarkerIcon';
import { setStopAction } from '../router/action';
import { RouterContext } from '../router/Router';

const otherIcon = {
  url: '/pins.png',
  size: { height: 26, width: 24 },
  scaledSize: { height: 26, width: 120 },
  origin: { x: 0, y: 0 },
  anchor: { x: 12, y: 12 },
} as google.maps.Icon;

const selectedStop = {
  url: '/pins.png',
  size: { height: 26, width: 24 },
  scaledSize: { height: 26, width: 120 },
  origin: { x: 24, y: 0 },
  anchor: { x: 12, y: 20 },
} as google.maps.Icon;

interface Props {
  highlighted?: ReadonlySet<Stop['stop_id']>;
  highlightColor?: string;
  darkMode?: boolean;
}

export function StopMarkers(props: Props) {
  const { dispatch, point } = useContext(RouterContext);
  const highlightIconUrl = useMarkerIcon(
    props.darkMode ? '#25282C' : '#fff',
    props.highlightColor
  );

  const api = useApi();
  const stops = api?.stops || [];
  const selectedStopId = point?.type === 'stop' && point.stopId;

  let highlightIcon: google.maps.Icon | undefined;
  if (highlightIconUrl) {
    highlightIcon = {
      url: highlightIconUrl,
      size: { height: 26, width: 26 },
      scaledSize: { height: 26, width: 26 },
      origin: { x: 0, y: 0 },
      anchor: { x: 12, y: 12 },
    } as google.maps.Icon;
  }

  return (
    <>
      {stops.map((stop) => {
        const selected = stop.stop_id === selectedStopId;

        let icon = otherIcon;
        if (selected) {
          icon = selectedStop;
        } else if (props.highlighted?.has(stop.stop_id)) {
          icon = highlightIcon || otherIcon;
        }

        return (
          <Marker
            key={stop.stop_id}
            position={stop.position}
            icon={icon}
            title={selected ? `(Selected) ${stop.stop_name}` : stop.stop_name}
            onClick={() => dispatch(setStopAction(stop.stop_id))}
          />
        );
      })}
    </>
  );
}
