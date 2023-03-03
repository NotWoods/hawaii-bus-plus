import { Marker } from '@hawaii-bus-plus/react-google-maps';

import { useContext } from 'preact/hooks';
import { MyLocationContext } from './location/context';
import { pinsIcon } from './pins';

const userIcon = pinsIcon(2);

export function UserMarker() {
  const { coords } = useContext(MyLocationContext);

  if (!coords) return null;

  return <Marker position={coords} icon={userIcon} title="My location" />;
}
