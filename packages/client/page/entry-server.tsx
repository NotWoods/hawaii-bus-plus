import { renderToStringAsync } from 'preact-render-to-string';
import { Main } from './App';
import { PageHead } from './PageHead';
import { Router } from './router/Router';

export default async function renderPage(url: URL) {
  return {
    html: await renderToStringAsync(
      <Router initialUrl={url}>
        <PageHead />
        <Main />
      </Router>,
    ),
  };
}
