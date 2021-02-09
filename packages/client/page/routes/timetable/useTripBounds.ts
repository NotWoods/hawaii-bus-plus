import { useGoogleMap } from '@hawaii-bus-plus/react-google-maps';
import { useEffect } from 'preact/hooks';

export function useTripBounds(bounds?: google.maps.LatLngBoundsLiteral) {
  const map = useGoogleMap();
  useEffect(() => {
    map && bounds && map.fitBounds(bounds);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [map, bounds?.east, bounds?.north, bounds?.south, bounds?.west]);
}
