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
  state.folder = {
    ...data
  }
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

export function secret (state, data) {
  state.secret = data
}

export function group (state, data) {
  state.group = data
}

export function collections (state, data) {
  state.collections = data
}

export function currentCollection (state, data) {
  state.currentCollection = data
}

export function search (state, data) {
  state.search = data
}

export function searchterm (state, data) {
  state.searchterm = data
}

export function menu (state, data) {
  state.menu = data
}

export function activepage (state, data) {
  state.activepage = data
}

export function clearCachedBooks (state) {
  // mutate state
  state.groupDetails.cached_books = []
}

export function addCachedBook (state, book) {
  // mutate state
  state.groupDetails.cached_books.push(book)
}
