import { Trip } from '@hawaii-bus-plus/types';
import { ComponentChildren, h } from 'preact';

interface Props {
  idToTrips: ReadonlyMap<Trip['direction_id'], readonly Trip[]>;
}

export function directionLists(
  map: ReadonlyMap<Trip['direction_id'], readonly Trip[]>,
  callback: (value: Trip) => ComponentChildren
) {
  return Array.from(map, ([id, trips]) => (
    <ul key={id} class="mb-4">
      {trips.map(callback)}
    </ul>
  ));
}

export function TableOfContents({ idToTrips }: Props) {
  return (
    <aside id="toc">
      {directionLists(idToTrips, (trip) => (
        <li key={trip.trip_id}>
          <a href={`#${trip.trip_id}`}>{trip.trip_short_name}</a>
        </li>
      ))}
    </aside>
  );
}
