module.exports = {
  mode: 'jit',
  purge: [
    './layouts/**/*.vue',
    './components/**/*.vue',
    './pages/**/*.vue'
  ],
  darkMode: 'class', // or 'media' or 'class'
  theme: {
    extend: {
      colors: {
        gray: {
          750: '#2c3340',
          840: '#1a2331',
          860: '#161f2c',
        }
      },
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
