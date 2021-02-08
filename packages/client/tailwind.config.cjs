module.exports = {
  purge: ['./index.html', './page/**/*.tsx'],
  darkMode: 'class',
  theme: {
    fontFamily: {
      display: ['Red Rose', 'serif'],
    },
    extend: {},
  },
  variants: {
    extend: {},
  },
  plugins: [
    require('@tailwindcss/aspect-ratio'),
    require('@tailwindcss/forms'),
    require('@tailwindcss/typography'),
  ],
};
