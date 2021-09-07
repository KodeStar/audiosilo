export function loginsecret (state, data) {
  state.loginsecret = data
}

export function player (state, data) {
  state.player = data
}

export function loginStatus (state, data) {
  state.loginStatus = data
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
