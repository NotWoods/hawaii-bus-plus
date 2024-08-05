import '../assets/main.css';

void Promise.all([
  import('../services/setup'),
  import('./api'),
  import('./entry-client-lazy'),
]);

export {};
