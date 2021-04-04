import { Trip } from '@hawaii-bus-plus/types';
import { h } from 'preact';

interface Props {
  idToTrips: ReadonlyMap<Trip['direction_id'], readonly Trip[]>;
}

export function TableOfContents({ idToTrips }: Props) {
  return (
    <aside
      id="toc"
      class="grid-area-toc mx-6 md:sticky top-4 text-gray-700 dark:text-gray-300"
    >
      <h3 class="font-display font-medium text-lg">Schedule index</h3>
      {Array.from(idToTrips, ([id, trips]) => (
        <ul key={id} class="mb-4 pl-6 list-disc">
          {trips.map((trip) => (
            <li key={trip.trip_id}>
              <a href={`#${trip.trip_id}`} class="hover:underline">
                {trip.trip_short_name}
              </a>
            </li>
          ))}
        </ul>
      ))}
    </aside>
  );
}
