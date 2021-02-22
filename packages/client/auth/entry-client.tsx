import 'preact/debug';
import { h, render } from 'preact';
import { App, urlToType } from './App';
import { HeaderType } from './components/Header';

if (window.location.hostname !== 'localhost') {
  void import('insights-js').then((insights) => {
    insights.init('KXNUdTJ9I4iYXHGo');
    insights.trackPages();
  });
}

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
const params = {
  token: url.searchParams.get('token') ?? undefined,
  existingEmail: url.searchParams.get('email') ?? undefined,
  newEmail: url.searchParams.get('new_email') ?? undefined,
  redirectTo:
    context.redirectTo ?? url.searchParams.get('redirect_to') ?? undefined,
};

render(
  <App defaultType={context.type ?? urlToType(url)} {...params} />,
  document.getElementById('root')!
);
