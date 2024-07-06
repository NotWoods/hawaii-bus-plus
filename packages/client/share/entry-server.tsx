import type { Repository } from '@hawaii-bus-plus/data';

import { renderToStringAsync } from 'preact-render-to-string';
import { App } from './App';
import { loadRoute, urlToRouteId } from './url-to-route';

export default async function renderSharingPage(url: URL, repo: Repository) {
  const routeId = urlToRouteId(url);
  const data = await loadRoute(repo, routeId);
  return {
    html: await renderToStringAsync(<App {...data} />),
  };
}
