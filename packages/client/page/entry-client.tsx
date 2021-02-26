import 'preact/debug';
import { h, hydrate } from 'preact';
import { App } from './App';
import '../all-pages/main.css';

if (window.location.hostname !== 'localhost') {
  void import('insights-js').then((insights) => {
    insights.init('KXNUdTJ9I4iYXHGo');
    insights.trackPages();
  });
}

hydrate(<App />, document.getElementById('root')!);
