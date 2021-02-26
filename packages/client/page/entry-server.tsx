import { h } from 'preact';
import render from 'preact-render-to-string';
import { Main } from './App';
import { Router } from './router/Router';

export default function renderPage(url: URL) {
  /*const [stops, stations] = await Promise.all([
    repo.loadAllStops(),
    repo.loadBikeStations(),
  ]);
  const api: Api = {
    stops,
    bikeStations: Object.fromEntries(
      stations.map((station) => [station.station_id, station])
    ),
  };
  const detailContext: RouteDetailContext = {
    directionId: 0,
    setDetails() {},
  };

  const state = initStateFromUrl(url);
  if (state.main?.path === ROUTES_PREFIX) {
    const details = await getRouteDetails(repo, state.main.routeId);
    detailContext.details = details;

    const directions = details?.directions ?? [];
    if (directions.length > 1) {
      detailContext.switchDirection = () => {};
    }
  }*/

  return {
    html: render(
      <Router initialUrl={url}>
        <Main />
      </Router>
    ),
    head: '',
  };
}
