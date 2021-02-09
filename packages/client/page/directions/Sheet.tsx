import { h } from 'preact';
import { useContext } from 'preact/hooks';
import { RouterContext } from '../router/Router';
import { RouteTimetable } from '../routes/RouteTimetable';
import { JourneySheet } from './JourneySheet';

export function Sheet() {
  const { directions } = useContext(RouterContext);

  return directions?.journey ? (
    <JourneySheet journey={directions.journey} timeZone="Pacific/Honolulu" />
  ) : (
    <RouteTimetable />
  );
}
