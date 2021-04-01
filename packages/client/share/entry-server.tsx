import { Repository } from '@hawaii-bus-plus/data';
import { h } from 'preact';
import render from 'preact-render-to-string';
import { App } from './App';
import { loadRoute, urlToRouteId, renderTitle } from './url-to-route';

export default async function renderSharingPage(url: URL, repo: Repository) {
  const routeId = urlToRouteId(url);
  const data = await loadRoute(repo, routeId);
  return {
    html: render(<App {...data} />),
    head: `<title>${renderTitle(data.route)}</title><!--head-html-->`,
  };
}
