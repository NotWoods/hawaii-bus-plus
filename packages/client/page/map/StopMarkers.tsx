import { Marker } from '@hawaii-bus-plus/react-google-maps';
import { ColorString, Stop } from '@hawaii-bus-plus/types';
import { h, Fragment } from 'preact';
import { useContext } from 'preact/hooks';
import { useApi } from '../hooks/useApi';
import { setStopAction } from '../router/action';
import { RouterContext } from '../router/Router';
import { pinsIcon } from './pins';

const otherIcon = pinsIcon(0);
const selectedStop = pinsIcon(1);

interface Props {
  highlighted?: ReadonlyMap<Stop['stop_id'], ColorString>;
  darkMode?: boolean;
}

function makeHighlightIcon(
  ringColor: ColorString,
  dark?: boolean
): google.maps.Icon {
  return ({
    path: 'M6,12a6,6 0 1,0 12,0a6,6 0 1,0 -12,0',
    fillColor: dark ? '#333' : '#fff',
    fillOpacity: 1,
    strokeWeight: 4,
    strokeColor: ringColor,
    anchor: { x: 12, y: 12 },
  } as unknown) as google.maps.Icon;
}

export function StopMarkers(props: Props) {
  const { dispatch, point } = useContext(RouterContext);

  const api = useApi();
  const stops = api?.stops ?? [];
  const selectedStopId = point?.type === 'stop' && point.stopId;

  return (
    <>
      {stops.map((stop) => {
        const selected = stop.stop_id === selectedStopId;
        const highlightColor = props.highlighted?.get(stop.stop_id);

        let icon = otherIcon;
        if (selected) {
          icon = selectedStop;
        } else if (highlightColor != undefined) {
          icon = makeHighlightIcon(highlightColor, props.darkMode);
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
