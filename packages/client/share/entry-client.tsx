import { MemoryRepository } from '@hawaii-bus-plus/data';
import { h, hydrate } from 'preact';
import 'preact/debug';
import '../all-pages/main.css';
import { App } from './App';
import { loadRoute, urlToRouteId } from './url-to-route';

const repo = new MemoryRepository();
const routeId = urlToRouteId(new URL(window.location.href));

async function render() {
  const data = await loadRoute(repo, routeId);

  hydrate(<App {...data} />, document.getElementById('root')!);
}
render().catch((err) => console.error(err));
