const colors = require('tailwindcss/colors');

module.exports = {
  mode: 'jit',
  purge: [
    './index.html',
    './auth/index.html',
    './page/**/*.tsx',
    './auth/**/*.tsx',
    './settings/**/*.tsx',
    './share/**/*.tsx',
    './all-pages/**/*.tsx',
  ],
  darkMode: 'media',
  theme: {
    fontFamily: {
      display: ['Red Rose', 'Copperplate Gothic', 'Copperplate', 'serif'],
    },
    colors: {
      black: colors.black,
      white: colors.white,
      route: 'var(--route-color)',
      gray: {
        ...colors.trueGray,
        750: '#333',
      },
      primary: {
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
      ocean: {
        light: '#778a91',
        DEFAULT: '#335468',
        dark: '#2d4859',
      },
    },
    keyframes: {
      enter: {
        from: { transform: 'translateY(25vh)' },
        to: { transform: 'translateY(0)' },
      },
      shake: {
        from: { transform: 'translateY(-1%)' },
        to: { transform: 'translateY(3%)' },
      },
      line: {
        '0%, 25%': { 'stroke-dashoffset': 22 },
        '50%, 51%': { 'stroke-dashoffset': 0 },
        '80%, 100%': { 'stroke-dashoffset': -22 },
      },
    },
    animation: {
      shake: 'shake 0.2s ease-in-out infinite alternate',
      line: 'line 0.8s ease-in-out infinite normal both',
    },
    extend: {
      fill: (theme) => ({
        'primary-500': theme('colors.primary.500'),
        'primary-600': theme('colors.primary.600'),
      }),
      textColor: {
        route: 'var(--route-text-color)',
      },
    },
  },
  plugins: [
    require('@tailwindcss/aspect-ratio'),
    require('@tailwindcss/forms'),
    require('tailwindcss-scroll-snap'),
  ],
};
