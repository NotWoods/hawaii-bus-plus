import { Point } from '@hawaii-bus-plus/presentation';
import { MarkerWithData } from '@hawaii-bus-plus/react-google-maps';
import { StationInformation } from '@hawaii-bus-plus/types';
import { h, Fragment } from 'preact';
import {
  PointRouterAction,
  setBikeStationAction,
} from '../../router/action/point';
import { pinsIcon } from '../pins';
import { SelectableMarker } from './SelectableMarker';

const bikeIcon = pinsIcon(4);

interface Props {
  stations: readonly StationInformation[];
  point?: Point;
  dispatch(action: PointRouterAction): void;
}

export function BikeStationMarkers({ point, stations, dispatch }: Props) {
  const selectedId = point?.type === 'bike' && point.stationId;

  function handleClick(this: MarkerWithData<StationInformation>) {
    const station = this.get('extra');
    dispatch(setBikeStationAction(station.station_id, station));
  }

  return (
    <>
      {stations.map((station) => {
        return (
          <SelectableMarker
            key={station.station_id}
            position={station.position}
            selected={station.station_id === selectedId}
            icon={bikeIcon}
            name={station.name}
            extra={station}
            onClick={handleClick}
          />
        );
      })}
    </>
  );
}
