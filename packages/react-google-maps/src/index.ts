import _lightStyles from './light-style.json';
import _darkStyles from './dark-style.json';
export const lightStyles = _lightStyles as google.maps.MapTypeStyle[];
export const darkStyles = _darkStyles as google.maps.MapTypeStyle[];

export type { MarkerWithData } from './drawing/Marker';
export { Marker } from './drawing/Marker';
export { Polyline } from './drawing/Polyline';
export { StreetViewPano } from './streetview/StreetViewPano';
export { StreetViewStatic } from './streetview/StreetViewStatic';
export { GoogleMap } from './GoogleMap';
export * from './MapProvider';
