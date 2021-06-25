export const PROD_LOCATION = window.location.hostname !== 'localhost';

export function setupAnalytics() {
  return import('insights-js').then((insights) => {
    insights.init('KXNUdTJ9I4iYXHGo');
    insights.trackPages();
  });
}
