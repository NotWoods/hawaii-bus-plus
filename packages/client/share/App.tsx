import { MultiMap } from '@hawaii-bus-plus/mnemonist';
import { Agency, Route, Stop, Trip } from '@hawaii-bus-plus/types';
import { Fragment, h } from 'preact';
import { Logo } from '../all-pages/components/Logo';
import { PageTitle } from '../all-pages/components/PageTitle';
import { colorVariables } from '../page/routes/props';
import { RouteDetailsCard } from '../page/routes/timetable/RouteDetails';
import { extractLinks } from '../worker-info/description';
import { ShareHeader } from './components/ShareHeader';
import { StaticMap } from './components/StaticMap';
import { StopTimeSegments } from './components/StopTimeSegments';
import { directionLists, TableOfContents } from './components/TableOfContents';
import { renderTitle } from './url-to-route';

interface Props {
  route: Route;
  agency: Agency;
  stops: ReadonlyMap<Stop['stop_id'], Stop>;
  trips: readonly Trip[];
}

function groupByDirectionId(
  trips: readonly Trip[]
): ReadonlyMap<Trip['direction_id'], readonly Trip[]> {
  const idToTrips = new MultiMap<Trip['direction_id'], Trip>();
  for (const trip of trips) {
    idToTrips.set(trip.direction_id, trip);
  }
  return idToTrips;
}

export function App({ route, agency, trips, stops }: Props) {
  const idToTrips = groupByDirectionId(trips);
  return (
    <>
      <header>
        <PageTitle>{renderTitle(route)}</PageTitle>
        <a href="https://hawaiibusplus.com">
          <Logo />
        </a>
      </header>
      <article style={colorVariables(route)}>
        <ShareHeader route={route} />
        <StaticMap route={route} stops={stops.values()} />

        <TableOfContents idToTrips={idToTrips} />
        <ul>
          {directionLists(idToTrips, (trip) => (
            <StopTimeSegments
              key={trip.trip_id}
              trip={trip}
              agency={agency}
              stops={stops}
            />
          ))}
        </ul>
        <RouteDetailsCard
          route={route}
          agency={agency}
          descParts={extractLinks(route.route_desc)}
        />
      </article>
    </>
  );
}
