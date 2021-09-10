export function loginsecret (state, data) {
  state.loginsecret = data
}

export function rightbar (state, data) {
  state.rightbar = data
}

export function player (state, data) {
  state.player = data
}

export function groupDetails (state, data) {
  state.groupDetails = data
}

export function playbackSpeed (state, data) {
  state.groupDetails.playback_speed = data
}

export function book (state, data) {
  state.book = data
}

export function folder (state, data) {
  state.folder = data
}

export function description (state, data) {
  state.book.description = data
}

export function cover (state, data) {
  state.book.cover = data
}

export function folderDescription (state, data) {
  state.folderDescription = data
}

export function loginStatus (state, data) {
  state.loginStatus = data
}

export function server (state, data) {
  state.server = data
}

export function initialiseApp (state) {
  const server = localStorage.getItem('server')
  const group = localStorage.getItem('group')
  const loginsecret = localStorage.getItem('loginsecret')
  const loginStatus = localStorage.getItem('loginStatus')
  if (server) {
    state.server = server
  }
  if (group) {
    state.group = group
  }
  if (loginsecret) {
    state.loginsecret = loginsecret
  }
  if (loginStatus) {
    state.loginStatus = loginStatus
  }
}
