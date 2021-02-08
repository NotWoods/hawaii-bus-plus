import 'preact/debug';
import { h, render } from 'preact';
import './main.css';
import 'halfmoon/css/halfmoon-variables.css';
import { App } from './App';

{
  let apiKey = localStorage.getItem('api-key');
  if (!apiKey) {
    apiKey = prompt('Enter password');
    localStorage.setItem('api-key', apiKey!);
  }
}

render(<App />, document.getElementById('root')!);
