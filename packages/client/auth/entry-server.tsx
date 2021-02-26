import { h } from 'preact';
import render from 'preact-render-to-string';
import { App, urlToType } from './App';
import { renderTitle } from './components/Title';

export default function renderAuthPage(url: URL) {
  const type = urlToType(url);
  return {
    html: render(<App defaultType={type} />),
    head: `<title>${renderTitle(type)}</title>
    <script>window.ctx = ${JSON.stringify({ type })}</script>`,
  };
}
