/* eslint-disable @typescript-eslint/no-floating-promises */

if (window.location.hostname !== 'localhost') {
  import('insights-js').then((insights) => {
    insights.init('KXNUdTJ9I4iYXHGo');
    insights.trackPages();
  });
}

if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('/sw.js');
}

export {};
