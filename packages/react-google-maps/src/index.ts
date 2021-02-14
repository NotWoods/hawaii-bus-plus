import _lightStyles from './light-style.json';
import _darkStyles from './dark-style.json';
export const lightStyles = _lightStyles as google.maps.MapTypeStyle[];
export const darkStyles = _darkStyles as google.maps.MapTypeStyle[];

export * from './drawing/Marker';
export * from './drawing/Polyline';
export * from './GoogleMap';
export * from './MapProvider';
export * from './StreetViewPano';
export * from './hooks';
export * from './options';
