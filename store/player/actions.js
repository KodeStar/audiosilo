export function resetPlayer ({ commit }) {
  commit('resetPlayer')
}

export async function load (context, data) {
  // context.commit('resetPlayer')
  context.commit('app/player', true, { root: true })
  context.commit('playing', false)

  const folder = {
    ...context.rootState.app.folder
  }

  if (!data) {
    data = loadCurrent(context)
  }
  let path = context.rootGetters['app/getFileUrl'](data.file)
  const filedetails = {
    hash: context.rootState.app.book.hash,
    file: path
  }
  const isCached = await context.dispatch('app/fileIsCached', filedetails, { root: true })
  if (isCached) {
    const cachedFile = await context.dispatch('app/getCachedFile', filedetails, { root: true })
    path = cachedFile.src
    // format = cachedFile.format
  }

  const audio = {
    src: path,
    currentTime: data.seek.toFixed(2)
  }
  context.commit('player', audio)
  context.commit('files', folder.files)
  context.commit('current', data.seek)
}

export function loadCurrent (context) {
  const folder = context.rootState.app.folder
  const book = context.rootState.app.book
  const data = {}
  getCurrentFile(context, {
    files: folder.files,
    seek: book.seek
  })
  // const currentFile = context.rootState.player.currentFile
  const currentFile = context.state.currentFile
  console.log(currentFile)
  data.file = currentFile.path
  data.seek = globalSeekToLocalSeek(context, {
    global: book.seek,
    local: currentFile.start
  })
  return data
}

export function getCurrentFile (context, data) {
  console.log('getCurrentFile')
  console.log(data)
  let start = 0
  for (let i = 0, length = data.files.length; i < length; i++) {
    console.log(start + data.files[i].meta.duration)
    console.log('seek: ' + data.seek)
    if (start + data.files[i].meta.duration > data.seek) {
      return context.commit('currentFile', {
        index: i,
        start,
        duration: data.files[i].meta.duration,
        path: data.files[i].path
      })
    }
    start += data.files[i].meta.duration
  }
}

export function globalSeekToLocalSeek (context, data) {
  return data.global - data.local
}

export function setGlobalSeek (context) {

}
