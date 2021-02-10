const colors = require('tailwindcss/colors');

module.exports = {
  purge: ['./index.html', './page/**/*.tsx'],
  darkMode: 'media',
  theme: {
    fontFamily: {
      display: ['Red Rose', 'serif'],
    },
    backgroundColor: (theme) => ({
      ...theme('colors'),
      route: 'var(--route-color)',
    }),
    textColor: (theme) => ({
      ...theme('colors'),
      route: 'var(--route-text-color)',
    }),
    extend: {
      inset: {
        '3/4-screen': '75vh',
      },
      minHeight: {
        '1/4-screen': '25vh',
      },
      colors: {
        gray: colors.trueGray,
        blue: colors.coolGray,
      },
      zIndex: {
        '-1': '-1',
      },
    },
  },
  plugins: [
    require('@tailwindcss/aspect-ratio'),
    require('@tailwindcss/forms'),
    require('tailwindcss-scroll-snap'),
  ],
};
