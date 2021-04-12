// @ts-check

/** @type {import('workbox-build').GenerateSWConfig} */
const config = {
  swDest: '../../dist/sw.js',
  globDirectory: '../../dist/',
  globPatterns: [
    'assets/**/*',
    'auth/!(index).html',
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

module.exports = config;
