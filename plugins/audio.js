export default ({ app }, inject) => {
  // Inject $hello(msg) in Vue, context and store.

  function secondsToTIme (secs, pad = true) {
    let h = Math.floor(secs / 3600).toString()
    let m = Math.floor(secs % 3600 / 60).toString()
    let s = Math.floor(secs % 60).toString()

    if (pad) {
      h = h.padStart(2, '0')
      m = m.padStart(2, '0')
      s = s.padStart(2, '0')
    }
    return {
      h,
      m,
      s
    }
  }
  inject('formatToTime', (secs, precision = 2, pad = true) => {
    const time = secondsToTIme(secs, pad)
    let output = ''
    if (time.h > 0) {
      output += time.h + 'h'
    }
    output += time.m + 'm'
    if (precision === 3) {
      output += time.s + 's'
    }
    return output
  })
  inject('formatToPlayback', (secs, pad = true) => {
    const time = secondsToTIme(secs, pad)
    let output = ''

    if (time.h > 0) {
      output += time.h + ':'
    }

    return output + String(time.m).padStart(2, '0') + ':' + String(time.s).padStart(2, '0')
  })
}
