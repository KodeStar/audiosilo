module.exports = {
  mode: 'jit',
  purge: [
    './layouts/**/*.vue',
    './components/**/*.vue',
    './pages/**/*.vue'
  ],
  darkMode: false, // or 'media' or 'class'
  theme: {
    extend: {
      width: {
        18: '4.5rem'
      }
    },
  },
  variants: {
    extend: {},
  },
  plugins: [
    require('@tailwindcss/typography')
  ],
}
