import 'preact/debug';
import { render } from 'preact';
import { App, urlToType } from './App';
import { HeaderType } from './components/Header';
import '../assets/main.css';

declare global {
  interface Window {
    ctx?: {
      type?: HeaderType;
      redirectTo?: string;
    };
  }
}

const context = window.ctx ?? {};
const url = new URL(window.location.href);

render(
  <App
    defaultType={context.type ?? urlToType(url)}
    token={url.searchParams.get('token') ?? undefined}
    existingEmail={url.searchParams.get('email') ?? undefined}
    redirectTo={
      context.redirectTo ?? url.searchParams.get('redirect_to') ?? undefined
    }
  />,
  document.getElementById('root')!,
);
