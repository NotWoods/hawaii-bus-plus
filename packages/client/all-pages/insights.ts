let insightsLoaded = Promise.resolve();

if (window.location.hostname !== 'localhost') {
  insightsLoaded = import('insights-js').then((insights) => {
    insights.init('KXNUdTJ9I4iYXHGo');
    insights.trackPages();
  });
}

export { insightsLoaded };
