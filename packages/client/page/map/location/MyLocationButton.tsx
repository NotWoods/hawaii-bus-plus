import { useGoogleMap } from '@hawaii-bus-plus/react-google-maps';
import { h } from 'preact';
import { useEffect, useState } from 'preact/hooks';
import { convertLatLng } from 'spherical-geometry-js';
import { useGeolocation } from '../../hooks/useGeolocation';
import { usePromise } from '../../hooks/usePromise';
import locationIcon from '../../icons/gps_fixed.svg';
import { Icon } from '../../icons/Icon';
import { UserMarker } from '../PlaceMarker';

export function MyLocationButton() {
  const map = useGoogleMap();
  const [shouldCenter, setShouldCenter] = useState(false);
  const [active, setActive] = useState(false);
  const coords = useGeolocation(active);
  const latLng = coords && convertLatLng(coords).toJSON();

  function handleClick() {
    setShouldCenter(true);
    setActive(true);
  }

  usePromise(async () => {
    const { state } = await navigator.permissions.query({
      name: 'geolocation',
    });
    if (state === 'granted') {
      setActive(true);
    }
  }, []);

  useEffect(() => {
    if (shouldCenter && map && latLng) {
      map.panTo(latLng);
      setShouldCenter(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [shouldCenter, map]);

  return (
    <button className="btn btn-sm" type="button" onClick={handleClick}>
      <Icon src={locationIcon} alt="" /> My location
      {latLng ? <UserMarker position={latLng} /> : null}
    </button>
  );
}
