import { Marker } from '@hawaii-bus-plus/react-google-maps';
import { GbfsWrapper, JsonStationInformation } from '@hawaii-bus-plus/types';
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
  const [stations, setStations] = useState<readonly JsonStationInformation[]>(
    []
  );

  usePromise(async (signal) => {
    const res = await fetch(
      'https://kona.publicbikesystem.net/ube/gbfs/v1/en/station_information',
      {
        signal,
      }
    );
    const json = (await res.json()) as GbfsWrapper<{
      stations: JsonStationInformation[];
    }>;
    const { stations } = json.data;
    setStations(stations);
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
            position={{ lat: station.lat, lng: station.lon }}
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
