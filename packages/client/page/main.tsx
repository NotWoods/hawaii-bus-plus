import React from 'react';
import ReactDOM from 'react-dom';
import 'halfmoon/css/halfmoon-variables.css';
import { App } from './App';

{
  let apiKey = localStorage.getItem('api-key');
  if (!apiKey) {
    apiKey = prompt('Enter password');
    localStorage.setItem('api-key', apiKey!);
  }
}

ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById('root')
);
