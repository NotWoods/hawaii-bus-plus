import './main.css';
import 'preact/debug';
import { h, render } from 'preact';
import { FormType } from './components/Form';
import { App } from './App';

if (window.location.hostname !== 'localhost') {
  void import('insights-js').then((insights) => {
    insights.init('KXNUdTJ9I4iYXHGo');
    insights.trackPages();
  });
}

function urlToType(url: URL): FormType | undefined {
  let path = url.pathname;
  if (!path.startsWith('/auth/')) {
    return undefined;
  }
  path = path.slice('/auth/'.length);
  if (path.endsWith('/')) {
    path = path.slice(0, -1);
  }

  switch (path) {
    case 'login':
      return 'login';
    case 'register':
      return 'signup';
    case 'forgot':
      return 'requestPasswordRecovery';
    case 'recover':
      return 'recover';
    case 'invite':
      return 'acceptInvite';
    default:
      return undefined;
  }
}

const url = new URL(window.location.href);
const params = {
  token: url.searchParams.get('token') ?? undefined,
  existingEmail: url.searchParams.get('email') ?? undefined,
  newEmail: url.searchParams.get('new_email') ?? undefined,
  redirectTo: url.searchParams.get('redirect_to') ?? undefined,
};

render(
  <App type={urlToType(url)} {...params} />,
  document.getElementById('root')!
);
