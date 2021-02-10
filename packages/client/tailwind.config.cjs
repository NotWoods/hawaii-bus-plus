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
    /*colors: {
      transparent: 'transparent',
      current: 'currentColor',
      gray: {
        dark: '#141518',
        DEFAULT: '#322938',
        light: '#766184',
      },
    },*/
    extend: {},
  },
  variants: {
    extend: {},
  },
  plugins: [
    require('@tailwindcss/aspect-ratio'),
    require('@tailwindcss/forms'),
    require('@tailwindcss/typography'),
    require('tailwindcss-scroll-snap'),
  ],
};
