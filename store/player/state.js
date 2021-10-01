export default {
  player: new Audio(),
  playing: false,
  loading: false,
  current: 0,
  files: [],
  currentFile: {
    index: 0,
    start: 0,
    duration: 0,
    path: ''
  },
  sleep: null,
  sleepamount: null,
  sleepend: null,
  fadeout: null
}
