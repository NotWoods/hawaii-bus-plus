import { DefaultMap } from '@hawaii-bus-plus/mnemonist';
import type { MarkerWithData } from '@hawaii-bus-plus/react-google-maps';
import type { ColorString, Stop } from '@hawaii-bus-plus/types';

import { pinsIcon } from '../pins';
import { SelectableMarker } from './SelectableMarker';

const otherIcon = pinsIcon(0);

const baseHighlightIcon = {
  path: 'M6,12a6,6 0 1,0 12,0a6,6 0 1,0 -12,0',
  fillOpacity: 1,
  strokeWeight: 4,
  anchor: { x: 12, y: 12 } as google.maps.Point,
};

function makeHighlightIcon(
  ringColor: ColorString,
  dark: boolean,
): google.maps.Symbol {
  return Object.assign({}, baseHighlightIcon, {
    fillColor: dark ? '#333' : '#fff',
    strokeColor: ringColor,
  });
}

const iconCache = new DefaultMap<
  boolean,
  DefaultMap<ColorString, google.maps.Symbol>
>((dark) => new DefaultMap((color) => makeHighlightIcon(color, dark)));

interface Props {
  stop: Stop;
  selected?: boolean;
  highlightColor?: ColorString;
  focus?: boolean;
  darkMode: boolean;
  onClick(this: MarkerWithData<Stop>): void;
}

export function StopMarker({
  stop,
  selected,
  highlightColor,
  focus,
  darkMode,
  onClick,
}: Props) {
  const icon = highlightColor
    ? iconCache.get(darkMode).get(highlightColor)
    : otherIcon;

  return (
    <SelectableMarker
      selected={selected}
      focus={focus}
      position={stop.position}
      icon={icon}
      name={stop.stop_name}
      extra={stop}
      onClick={onClick}
    />
  );
}
