import React from 'react';
import ReactDOM from 'react-dom';
import 'halfmoon/css/halfmoon-variables.css';
import { App } from './App';

import NearbyWorker from '../worker-nearby/nearby?worker';
import { PromiseWorker } from '../shared/promise-worker';

(window as any).nearby = new PromiseWorker(new NearbyWorker());

ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById('root')
);
