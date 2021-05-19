import { useMap, useSetter } from '../apply-changes';
import { useGoogleMap } from '../MapProvider';
import { onUnmount } from './Marker';

interface Props {
  options: google.maps.PolylineOptions;
  /** Sets the path. The ordered sequence of coordinates of the Polyline. This path may be specified using either a simple array of LatLngs, or an MVCArray of LatLngs. Note that if you pass a simple array, it will be converted to an MVCArray Inserting or removing LatLngs in the MVCArray will automatically update the polyline on the map. */
  path: google.maps.MVCArray<google.maps.LatLng> | google.maps.LatLng[] | google.maps.LatLngLiteral[];
}

function createPolyline(map: google.maps.Map) {
  return { instance: new google.maps.Polyline({ map }), onUnmount };
}

export function Polyline(props: Props) {
  const map = useGoogleMap();
  const polyline = useMap<google.maps.Polyline>(map, createPolyline);

  const { options, path } = props;
  useSetter(polyline, options, (marker) => {
    marker.setOptions(options);
  });
  useSetter(polyline, path, (marker) => {
    marker.setPath(path);
  });

  return null;
}
