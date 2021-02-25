import { NodeRepository } from '@hawaii-bus-plus/data/node';
import { h } from 'preact';
import render from 'preact-render-to-string';
import { getRouteDetails } from '../worker-info/route-details';
import { Main } from './App';
import { Api, ApiContext } from './hooks/useApi';
import { initStateFromUrl } from './router/reducer';
import { Router } from './router/Router';
import { ROUTES_PREFIX } from './router/state';
import { RouteDetailContext } from './routes/timetable/context';

export default async function renderPage(url: URL) {
  const repo = new NodeRepository();
  const [stops, stations] = await Promise.all([
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
  }

  return {
    html: render(
      <Router url={url}>
        <ApiContext.Provider value={api}>
          <RouteDetailContext.Provider value={detailContext}>
            <Main />
          </RouteDetailContext.Provider>
        </ApiContext.Provider>
      </Router>
    ),
    head: '',
  };
}
