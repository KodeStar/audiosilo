export function totalTime (state) {
  let total = 0
  state.files.forEach((file) => {
    total += file.meta.duration
  })
  return total
}

export function getStart (state) {
  return (files) => {
    return files.reduce((a, b) => +a + +b.meta.duration, 0)
  }
}
