import { h } from 'preact';
import render from 'preact-render-to-string';
import { Main } from './App';
import { PageHead } from './PageHead';
import { Router } from './router/Router';

export default function renderPage(url: URL) {
  return {
    html: render(
      <Router initialUrl={url}>
        <PageHead />
        <Main />
      </Router>,
    ),
  };
}
