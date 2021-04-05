import { Point } from '@hawaii-bus-plus/presentation';
import { MarkerWithData } from '@hawaii-bus-plus/react-google-maps';
import { StationInformation } from '@hawaii-bus-plus/types';
import { Fragment, h } from 'preact';
import { useCallback } from 'preact/hooks';
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

  const handleClick = useCallback(
    function (this: MarkerWithData<StationInformation>) {
      const station = this.get('extra');
      dispatch(setBikeStationAction(station.station_id, station));
    },
    [dispatch],
  );

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
