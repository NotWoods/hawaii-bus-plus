import { MarkerWithData } from '@hawaii-bus-plus/react-google-maps';
import { ColorString, Stop } from '@hawaii-bus-plus/types';
import { useCallback } from 'preact/hooks';
import { setStopAction } from '../../router/action/point';
import { useDispatch, useSelector } from '../../router/hooks';
import { selectStop } from '../../router/selector/point';
import { StopMarker } from './StopMarker';

interface Props {
  stops: readonly Stop[];
  highlighted?: ReadonlyMap<Stop['stop_id'], ColorString>;
  focused?: ReadonlySet<Stop['stop_id']>;
  darkMode: boolean;
}

export function StopMarkers({ stops, highlighted, focused, darkMode }: Props) {
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
    <>
      {stops.map((stop) => {
        return (
          <StopMarker
            key={stop.stop_id}
            stop={stop}
            highlightColor={highlighted?.get(stop.stop_id)}
            selected={stop.stop_id === selectedStopId}
            focus={focused ? focused.has(stop.stop_id) : true}
            darkMode={darkMode}
            onClick={handleClick}
          />
        );
      })}
    </>
  );
}
