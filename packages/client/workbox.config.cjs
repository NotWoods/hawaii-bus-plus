module.exports = {
  swDest: '../../dist/sw.ts',
  globDirectory: '../../dist/',
  globPatterns: [
    'assets/**/*',
    'icon/**/*',
    'share/routes/*.html',
    '404.html',
    'index.html',
    'waves.svg',
  ],
  globStrict: true,
  offlineGoogleAnalytics: false,
  cleanupOutdatedCaches: true,
  navigateFallback: '/index.html',
  navigateFallbackAllowlist: [
    new RegExp('^/routes/'),
    new RegExp('^/directions'),
  ],
  dontCacheBustURLsMatching: new RegExp('^assets/'),
};
