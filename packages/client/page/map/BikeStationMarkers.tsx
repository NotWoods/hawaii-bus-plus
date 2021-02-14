import { Marker } from '@hawaii-bus-plus/react-google-maps';
import { StationInformation } from '@hawaii-bus-plus/types';
import { h, Fragment } from 'preact';
import { useContext, useState } from 'preact/hooks';
import { usePromise } from '../hooks/usePromise';
import { setBikeStationAction } from '../router/action';
import { RouterContext } from '../router/Router';
import { pinsIcon } from './pins';

const bikeIcon = pinsIcon(4);
const selectedStop = pinsIcon(1);

export function BikeStationMarkers() {
  const { dispatch, point } = useContext(RouterContext);
  const [stations, setStations] = useState<readonly StationInformation[]>([]);

  usePromise(async (signal) => {
    const res = await fetch('/api/v1/bike/station_information.json', {
      signal,
    });
    const json = await res.json();
    const stations = json as { [id: string]: StationInformation };
    setStations(Object.values(stations));
  }, []);

  const selectedId = point?.type === 'bike' && point.stationId;

  return (
    <>
      {stations.map((station) => {
        const selected = station.station_id === selectedId;
        const icon = selected ? selectedStop : bikeIcon;

        return (
          <Marker
            key={station.station_id}
            position={station.position}
            icon={icon}
            title={selected ? `(Selected) ${station.name}` : station.name}
            onClick={() =>
              dispatch(setBikeStationAction(station.station_id, station))
            }
          />
        );
      })}
    </>
  );
}
