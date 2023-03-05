import render from 'preact-render-to-string';
import { App, urlToType } from './App';

export default function renderAuthPage(url: URL) {
  const type = urlToType(url);
  return {
    html: render(<App defaultType={type} />),
  };
}
