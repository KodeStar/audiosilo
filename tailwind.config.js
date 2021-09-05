module.exports = {
  mode: 'jit',
  purge: [
    './pages/**/*.vue',
    './components/**/*.vue',
  ],
  darkMode: 'class', // or 'media' or 'class'
  theme: {
    extend: {
      colors: {
        dark: {
          50: '#87868b',
          100: '#414873',
          200: '#32385d',
          300: '#1d2038',
        },
      }
    },
  },
  variants: {
    extend: {
      backgroundColor: ['dark']
    },
  },
  plugins: [],
}
