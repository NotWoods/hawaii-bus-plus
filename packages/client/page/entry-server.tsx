import { h } from 'preact';
import render from 'preact-render-to-string';
import { Main } from './App';
import { Router } from './router/Router';

export default function renderPage(url: URL) {
  return {
    html: render(
      <Router initialUrl={url}>
        <Main />
      </Router>
    ),
    head: '',
  };
}
