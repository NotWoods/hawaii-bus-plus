/** @type {import('tailwindcss/tailwind-config').TailwindConfig} */
const config = {
  content: [
    './index.html',
    './auth/index.html',
    './page/**/*.tsx',
    './auth/**/*.tsx',
    './share/**/*.tsx',
    './assets/**/*.tsx',
    './components/**/*.tsx',
  ],
  darkMode: 'media',
  plugins: [
    require('@tailwindcss/aspect-ratio'),
    require('@tailwindcss/forms'),
    require('@hawaii-bus-plus/tailwind-theme'),
  ],
};

module.exports = config;
