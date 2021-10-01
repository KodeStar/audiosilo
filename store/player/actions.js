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
  data.file = currentFile.path
  data.seek = globalSeekToLocalSeek(context, {
    global: book.seek,
    local: currentFile.start
  })
  return data
}

export function getCurrentFile (context, data) {
  let start = 0
  for (let i = 0, length = data.files.length; i < length; i++) {
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

export function sleeptimer (context, mins) {
  console.log('sleeptimer')
  console.log(mins)
  const seconds = mins * 60 // mins to seconds
  const milliseconds = seconds * 1000 // conds to milliseconds
  console.log(milliseconds)

  context.commit('player/sleepamount', mins)
  context.commit('player/sleepend', Date.now() + milliseconds)

  const timerid = setTimeout(() => {
    // context.state.player.pause()
    context.commit('sleepend', null)
    context.commit('sleep', null)
    console.log('engage fadeout')
    fadeOut(context)
  }, milliseconds)

  context.commit('sleep', timerid)
}

export function fadeOut (context) {
  console.log('fadout')
  let to = 20
  const fadeout = setInterval(() => {
    const vol = to / 20
    context.state.player.volume = vol
    console.log(vol)
    if (to <= 0) {
      console.log('clear fadeout')
      clearInterval(fadeout)
      context.commit('fadeout', null)
      context.dispatch('app/savePauseEvent', context.state.currentFile.start + context.state.current, { root: true })
      context.state.player.pause()
      context.state.player.volume = 1
    }
    to--
  }, 1000)
  context.commit('fadeout', fadeout)
}

export function clearSleepTmer (context) {
  clearTimeout(context.state.sleep)
  context.commit('sleepend', null)
  context.commit('sleep', null)
}

export function clearFadeout (context) {
  const mins = context.state.sleepamount
  clearInterval(context.state.fadeout)
  context.commit('fadeout', null)
  context.state.player.volume = 1
  sleeptimer(context, mins)
}
