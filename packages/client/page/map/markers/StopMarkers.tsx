import { Point } from '@hawaii-bus-plus/presentation';
import { MarkerWithData } from '@hawaii-bus-plus/react-google-maps';
import { ColorString, Stop } from '@hawaii-bus-plus/types';
import { memoize } from '@hawaii-bus-plus/utils';
import { h, Fragment } from 'preact';
import { RouterAction, setStopAction } from '../../router/action';
import { pinsIcon } from '../pins';
import { SelectableMarker } from './SelectableMarker';

const otherIcon = pinsIcon(0);

interface Props {
  highlighted?: ReadonlyMap<Stop['stop_id'], ColorString>;
  focused?: ReadonlySet<Stop['stop_id']>;
  darkMode?: boolean;
  point?: Point;
  stops: readonly Stop[];
  dispatch(action: RouterAction): void;
}

const makeHighlightIcon = memoize(function highlightIcon(
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
});

export function StopMarkers({
  point,
  stops,
  highlighted,
  focused,
  darkMode,
  dispatch,
}: Props) {
  const selectedStopId = point?.type === 'stop' && point.stopId;

  function handleClick(this: MarkerWithData<Stop>) {
    const stop = this.get('extra');
    dispatch(setStopAction(stop.stop_id));
  }

  return (
    <>
      {stops.map((stop) => {
        const highlightColor = highlighted?.get(stop.stop_id);
        const icon = highlightColor
          ? makeHighlightIcon(highlightColor, darkMode)
          : otherIcon;

        return (
          <SelectableMarker
            key={stop.stop_id}
            selected={stop.stop_id === selectedStopId}
            focus={focused ? focused.has(stop.stop_id) : true}
            position={stop.position}
            icon={icon}
            name={stop.stop_name}
            extra={stop}
            onClick={handleClick}
          />
        );
      })}
    </>
  );
}
