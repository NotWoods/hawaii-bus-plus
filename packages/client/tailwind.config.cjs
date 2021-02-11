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
        '1/4-screen': '25vh',
        '3/4-screen': '75vh',
      },
      minHeight: {
        '1/4-screen': '25vh',
      },
      colors: {
        gray: colors.trueGray,
        blue: {
          50: 'hsl(212, 20%, 90%)',
          100: 'hsl(212, 10%, 72%)',
          200: 'hsl(212, 10%, 64%)',
          300: 'hsl(212, 10%, 53%)',
          400: 'hsl(212, 10%, 42%)',
          500: 'hsl(212, 10%, 32%)',
          600: 'hsl(212, 10%, 28%)',
          700: 'hsl(212, 10%, 22%)',
          800: 'hsl(212, 10%, 18%)',
          900: 'hsl(212, 10%, 10%)',
        },
        red: {
          DEFAULT: '#C67168',
        },
        yellow: {
          DEFAULT: '#E2C049',
        },
        brown: {
          DEFAULT: '#918381',
        },
        cyan: {
          DEFAULT: '#8BB9BD',
        },
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
