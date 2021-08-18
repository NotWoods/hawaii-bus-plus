export function registerServiceWorker() {
  return navigator.serviceWorker?.register('/sw.js');
}
