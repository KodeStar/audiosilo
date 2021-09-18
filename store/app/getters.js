export function getServerUrl (state) {
  let url = state.server
  if (state.currentCollection > 0) {
    url = state.server + state.currentCollection + '/'
  }
  return url
}

export function getFileUrl (state) {
  return (file) => {
    return getServerUrl(state) + 'audio/' + file + '?trans=0'
  }
}
