import { h, hydrate } from 'preact';
import 'preact/debug';
import '../all-pages/main.css';
import { App } from './App';

hydrate(<App />, document.getElementById('root')!);
