import { MarkerWithData } from '@hawaii-bus-plus/react-google-maps';
import { StationInformation } from '@hawaii-bus-plus/types';
import { memo } from 'preact/compat';
import { useCallback } from 'preact/hooks';
import { setBikeStationAction } from '../../router/action/point';
import { useDispatch, useSelector } from '../../router/hooks';
import { selectBikeStation } from '../../router/selector/point';
import { pinsIcon } from '../pins';
import { SelectableMarker } from './SelectableMarker';

const bikeIcon = pinsIcon(4);

interface Props {
  stations: readonly StationInformation[];
  selectedId?: StationInformation['station_id'];
  onClick(this: MarkerWithData<StationInformation>): void;
}

const BikeStationMarkersList = memo(
  ({ stations, selectedId, onClick }: Props) => {
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
              onClick={onClick}
            />
          );
        })}
      </>
    );
  },
);

export function BikeStationMarkers(props: Pick<Props, 'stations'>) {
  const selectedId = useSelector(selectBikeStation);
  const dispatch = useDispatch();

  const handleClick = useCallback(
    function (this: MarkerWithData<StationInformation>) {
      const station = this.get('extra');
      dispatch(setBikeStationAction(station.station_id, station));
    },
    [dispatch],
  );

  return (
    <BikeStationMarkersList
      stations={props.stations}
      selectedId={selectedId}
      onClick={handleClick}
    />
  );
}
