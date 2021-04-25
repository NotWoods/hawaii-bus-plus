import { useGoogleMap } from '@hawaii-bus-plus/react-google-maps';
import { useEffect } from 'preact/hooks';
import { useSelector } from '../router/hooks';
import { selectBounds } from '../router/selector/map';

export function MapBounds() {
  const map = useGoogleMap();
  const bounds = useSelector(selectBounds);

  useEffect(() => {
    map && bounds && map.fitBounds(bounds);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [map, bounds?.east, bounds?.north, bounds?.south, bounds?.west]);

  return null;
}
