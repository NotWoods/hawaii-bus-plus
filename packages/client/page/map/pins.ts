import pinsUrl from '../../assets/icons/pins.png';

const basePinsIcon = {
  url: pinsUrl,
  size: { height: 26, width: 24 } as google.maps.Size,
  scaledSize: { height: 26, width: 120 } as google.maps.Size,
  anchor: { x: 12, y: 12 } as google.maps.Point,
};

export function pinsIcon(index: number): google.maps.Icon {
  const origin = { x: index * 24, y: 0 } as google.maps.Point;
  return {
    ...basePinsIcon,
    origin,
  };
}
