import { Marker } from '@hawaii-bus-plus/react-google-maps';
import { h } from 'preact';
import { pinsIcon } from '../pins';

const selectedStop = pinsIcon(1);

interface Props {
  position: google.maps.LatLngLiteral;
  icon: string | google.maps.Icon | google.maps.Symbol;
  name: string;
  selected?: boolean;
  onClick(): void;
}

export function SelectableMarker(props: Props) {
  const { selected, name } = props;

  return (
    <Marker
      position={props.position}
      icon={selected ? selectedStop : props.icon}
      title={selected ? `(Selected) ${name}` : name}
      onClick={props.onClick}
    />
  );
}
