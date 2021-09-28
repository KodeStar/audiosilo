import defaultState from './state'
export function resetPlayer (state) {
  // Merge rather than replace so we don't lose observers
  // https://github.com/vuejs/vuex/issues/1118
  Object.assign(state, defaultState)
}

export function player (state, data) {
  state.player.src = data.src
  state.player.currentTime = data.currentTime
  state.player.crossOrigin = 'use-credentials'
}

export function files (state, data) {
  state.files = data
}

export function currentFile (state, data) {
  state.currentFile = data
}

export function playing (state, data) {
  state.playing = data
}

export function loading (state, data) {
  state.loading = data
}

export function current (state, data) {
  state.current = data
}
