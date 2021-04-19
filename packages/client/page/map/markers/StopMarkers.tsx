import { MarkerWithData } from '@hawaii-bus-plus/react-google-maps';
import { ColorString, Stop } from '@hawaii-bus-plus/types';
import { memoize } from '@hawaii-bus-plus/utils';
import { Fragment, h } from 'preact';
import { memo } from 'preact/compat';
import { useCallback } from 'preact/hooks';
import { setStopAction } from '../../router/action/point';
import { useDispatch, useSelector } from '../../router/hooks';
import { selectStop } from '../../router/selector/point';
import { pinsIcon } from '../pins';
import { SelectableMarker } from './SelectableMarker';

const otherIcon = pinsIcon(0);

interface Props {
  stops: readonly Stop[];
  selectedId?: Stop['stop_id'];
  highlighted?: ReadonlyMap<Stop['stop_id'], ColorString>;
  focused?: ReadonlySet<Stop['stop_id']>;
  darkMode?: boolean;
  onClick(this: MarkerWithData<Stop>): void;
}

const makeHighlightIcon = memoize(function highlightIcon(
  ringColor: ColorString,
  dark?: boolean,
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

const StopMarkersList = memo(
  ({ stops, selectedId, highlighted, focused, darkMode, onClick }: Props) => {
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
              selected={stop.stop_id === selectedId}
              focus={focused ? focused.has(stop.stop_id) : true}
              position={stop.position}
              icon={icon}
              name={stop.stop_name}
              extra={stop}
              onClick={onClick}
            />
          );
        })}
      </>
    );
  },
);

export function StopMarkers(props: Omit<Props, 'selectedId' | 'onClick'>) {
  const selectedStopId = useSelector(selectStop);
  const dispatch = useDispatch();

  const handleClick = useCallback(
    function (this: MarkerWithData<Stop>) {
      const stop = this.get('extra');
      dispatch(setStopAction(stop.stop_id));
    },
    [dispatch],
  );

  return (
    <StopMarkersList
      {...props}
      selectedId={selectedStopId}
      onClick={handleClick}
    />
  );
}
