import { MemoryRepository } from '@hawaii-bus-plus/data';
import { h, hydrate } from 'preact';
import 'preact/debug';
import '../all-pages/main.css';
import { buildShareHandler } from '../page/routes/timetable/details/DetailButtons';
import { App } from './App';
import { dynamicLoginButton } from './components/PageHeader';
import { loadRoute, urlToRouteId } from './url-to-route';

if (import.meta.env.DEV) {
  const repo = new MemoryRepository();
  const routeId = urlToRouteId(new URL(window.location.href));

  (async function render() {
    const data = await loadRoute(repo, routeId);

    hydrate(<App {...data} />, document.getElementById('root')!);
  })().catch((err) => console.error(err));
} else {
  const shareButton = document.getElementById('share')!;
  shareButton.addEventListener(
    'click',
    buildShareHandler(document.title, (err) => console.error(err))
  );
  void dynamicLoginButton();
}
