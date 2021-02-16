import { ColorString, Stop } from '@hawaii-bus-plus/types';
import { h, Fragment } from 'preact';
import { useContext } from 'preact/hooks';
import { useApi } from '../../hooks/useApi';
import { RouterContext } from '../../router/Router';
import { BikeStationMarkers } from './BikeStationMarkers';
import { StopMarkers } from './StopMarkers';

interface Props {
  highlighted?: ReadonlyMap<Stop['stop_id'], ColorString>;
  darkMode?: boolean;
}

export function StopStationMarkers({ highlighted, darkMode }: Props) {
  const { dispatch, point } = useContext(RouterContext);
  const api = useApi();

  return (
    <>
      <StopMarkers
        stops={api ? api.stops : []}
        highlighted={highlighted}
        darkMode={darkMode}
        point={point}
        dispatch={dispatch}
      />
      <BikeStationMarkers
        stations={api ? Object.values(api.bikeStations) : []}
        point={point}
        dispatch={dispatch}
      />
    </>
  );
}
