const { theme } = require('@hawaii-bus-plus/tailwind-theme');

/** @type {import('tailwindcss/tailwind-config').TailwindConfig} */
const config = {
  mode: 'jit',
  purge: [
    './index.html',
    './auth/index.html',
    './page/**/*.tsx',
    './auth/**/*.tsx',
    './share/**/*.tsx',
    './assets/**/*.tsx',
    './components/**/*.tsx',
  ],
  darkMode: 'media',
  theme,
  plugins: [
    require('@tailwindcss/aspect-ratio'),
    require('@tailwindcss/forms'),
    require('tailwindcss-scroll-snap'),
  ],
};

module.exports = config;
