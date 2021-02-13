import 'preact/debug';
import { h, render } from 'preact';
import { App } from './App';

if (window.location.hostname !== 'localhost') {
  void import('insights-js').then((insights) => {
    insights.init('KXNUdTJ9I4iYXHGo');
    insights.trackPages();
  });
}

{
  let apiKey = localStorage.getItem('api-key');
  if (!apiKey) {
    apiKey = prompt('Enter password');
    localStorage.setItem('api-key', apiKey!);
  }
}

render(<App />, document.getElementById('root')!);
