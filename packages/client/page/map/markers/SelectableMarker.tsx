import { Marker, MarkerWithData } from '@hawaii-bus-plus/react-google-maps';

import { memo } from 'preact/compat';
import { pinsIcon } from '../pins';

const selectedStop = pinsIcon(1);

interface Props<T> {
  extra: T;
  position: google.maps.LatLngLiteral;
  icon: string | google.maps.Icon | google.maps.Symbol;
  name: string;
  selected?: boolean;
  focus?: boolean;
  onClick(this: MarkerWithData<T>): void;
}

function SelectableMarker<T>(props: Props<T>) {
  const { selected, focus = true, name } = props;

  return (
    <Marker
      position={props.position}
      icon={selected ? selectedStop : props.icon}
      title={selected ? `(Selected) ${name}` : name}
      opacity={focus || selected ? 1 : 0.5}
      data-extra={props.extra}
      onClick={props.onClick}
    />
  );
}

const SelectableMarkerMemo = memo(SelectableMarker);
export { SelectableMarkerMemo as SelectableMarker };
