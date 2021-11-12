import { MultiMap } from '@hawaii-bus-plus/mnemonist';
import { Agency, Route, Stop, Trip } from '@hawaii-bus-plus/types';
import { extractLinks } from '@hawaii-bus-plus/workers/info';
import { Fragment, h } from 'preact';
import { ExtendedFloatingActionButton } from '../components/FloatingActionButton/ExtendedFloatingActionButton';
import { colorVariables } from '../components/route-colors';
import { DetailButtons } from '../components/RouteDescription/DetailButtons';
import { RouteDescription } from '../components/RouteDescription/RouteDescription';
import { RouteHeader } from '../components/RouteHeader/RouteHeader';
import { Footer } from './components/Footer';
import { PageHeader } from './components/PageHeader';
import { StaticMap, staticMapUrl } from './components/StaticMap';
import { StopTimeSegments } from './components/StopTimeSegments';
import { TableOfContents } from './components/TableOfContents';
import { PageHead } from './PageHead';

export interface AppProps {
  route: Route;
  agency: Agency;
  stops: ReadonlyMap<Stop['stop_id'], Stop>;
  trips: readonly Trip[];
}

function groupByDirectionId(
  trips: readonly Trip[],
): ReadonlyMap<Trip['direction_id'], readonly Trip[]> {
  const idToTrips = new MultiMap<Trip['direction_id'], Trip>();
  for (const trip of trips) {
    idToTrips.set(trip.direction_id, trip);
  }
  return idToTrips;
}

export function App({ route, agency, trips, stops }: AppProps) {
  const idToTrips = groupByDirectionId(trips);

  const mapSize = { width: 640, height: 360 };
  const mapUrl = staticMapUrl({ ...mapSize, route, stops: stops.values() });

  return (
    <>
      <PageHead route={route} mapUrl={mapUrl} />
      <div class="waves px-4 shadow-lg">
        <PageHeader />
        <StaticMap {...mapSize} url={mapUrl} />
      </div>
      <article
        class="grid gap-y-4 share text-black dark:text-white max-w-5xl mx-auto mt-2"
        style={colorVariables(route)}
      >
        <RouteHeader route={route} />

        <DetailButtons
          class="grid-area-buttons px-2"
          route={route}
          agency={agency}
        />

        <TableOfContents
          directionHeaders={route.directions}
          idToTrips={idToTrips}
        />
        <ExtendedFloatingActionButton />
        <div class="grid-area-timetable space-y-8">
          {Array.from(idToTrips.entries(), ([id, trips]) => (
            <Fragment key={id}>
              <h4 class="font-display font-medium text-2xl mx-6">
                {route.directions[id]}
              </h4>
              {trips.map((trip) => (
                <StopTimeSegments
                  key={trip.trip_id}
                  trip={trip}
                  agency={agency}
                  stops={stops}
                />
              ))}
            </Fragment>
          ))}
        </div>
        <footer class="bg-white dark:bg-gray-700 shadow-inner px-4 pt-6 pb-16 grid-area-footer">
          <RouteDescription
            agency={agency}
            descParts={extractLinks(route.route_desc)}
          />
          <Footer />
        </footer>
      </article>
    </>
  );
}
