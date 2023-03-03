import { Route, Trip } from '@hawaii-bus-plus/types';
import { Fragment } from 'preact';

interface Props {
  directionHeaders: Route['directions'];
  idToTrips: ReadonlyMap<Trip['direction_id'], readonly Trip[]>;
}

export function TableOfContents({ idToTrips, directionHeaders }: Props) {
  return (
    <aside
      id="toc"
      class="grid-area-toc mx-6 md:sticky top-4 text-gray-700 dark:text-gray-300"
    >
      <h3 class="font-display font-medium text-lg text-black dark:text-white">
        Schedule index
      </h3>
      {Array.from(idToTrips, ([id, trips]) => (
        <Fragment key={id}>
          <h4 class="font-display font-medium">{directionHeaders[id]}</h4>
          <ul class="mb-4 pl-6 list-disc">
            {trips.map((trip) => (
              <li key={trip.trip_id}>
                <a href={`#${trip.trip_id}`} class="hover:underline">
                  {trip.trip_short_name}
                </a>
              </li>
            ))}
          </ul>
        </Fragment>
      ))}
    </aside>
  );
}
