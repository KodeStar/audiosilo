import marked from 'marked'
import { sha256 } from 'js-sha256'
import base64js from 'base64-js'
import VueCookies from 'vue-cookies'
import localForage from 'localforage'

export function setDetails (context, data) {
  console.log('set details')
  // console.log(localForage)
  localForage.setItem('server', data.server)
  localForage.setItem('group', data.group)
  localForage.setItem('loginStatus', data.loginStatus)
  localForage.setItem('collections', data.collections)
  localForage.setItem('currentCollection', data.currentCollection)
}
export async function getGroupDetails (context) {
  // This will need to come from the server at some point, where possible
  const currentDetails = await localForage.getItem('group-' + context.state.group)
  if (currentDetails) {
    context.commit('groupDetails', currentDetails)
  }
}
export function setGroupDetails (context) {
  // set to server when available

  // Set local copy for when offline
  localForage.setItem('group-' + context.state.group, context.state.groupDetails)
}

export function login (context, data) {
  let loginStatus = false
  let loginsecret = null
  if (data.secret) {
    // console.log('secret is ' + data.secret)
    const secretBytes = new (TextEncoder)('utf-8').encode(data.secret)
    const randomBytes = new Uint8Array(32)
    window.crypto.getRandomValues(randomBytes)
    const concatedBytes = new Uint8Array(secretBytes.length + randomBytes.length)
    concatedBytes.set(secretBytes)
    concatedBytes.set(randomBytes, secretBytes.length)
    let digestPromise
    if (!window.crypto.subtle) {
      digestPromise = Promise.resolve(sha256.arrayBuffer(concatedBytes))
    } else {
      digestPromise = window.crypto.subtle.digest('SHA-256', concatedBytes)
    }
    digestPromise
      .then((s) => {
        const thesecret = base64js.fromByteArray(randomBytes) + '|' + base64js.fromByteArray(new Uint8Array(s))
        // console.log(thesecret)
        const bodyFormData = 'secret=' + encodeURIComponent(thesecret)
        fetch(data.server + 'authenticate', {
          method: 'POST',
          mode: 'cors',
          credentials: 'include', // this one is essential - use it on all fetch requests
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
          },
          body: bodyFormData
        }).then(async (response) => {
          // console.log(response)
          // get collections
          loginsecret = await response.text()
          VueCookies.set('audioserve_token', loginsecret)
          loginStatus = true
          context.commit('loginStatus', loginStatus)

          const collections = await fetchCollections(context)

          setDetails(context, {
            ...data,
            loginStatus,
            collections: collections.names,
            currentCollection: 0
          })
        }).catch((err) => {
          console.log(err)
        })
        /* return ajax({
            url: baseUrl + "/authenticate",
            type: "POST",
            data: { secret: secret }

        }); */
      })
  } else {
    loginStatus = true
    loginsecret = 'noauth'
  }
  context.commit('loginsecret', loginsecret)
  context.commit('loginStatus', loginStatus)

  setDetails(context, {
    ...data,
    loginStatus
  })

  /*
  // console.log(data)
  const response = await firelogin(context, data)
  switch (response.data.status) {
    case 'ok':
      context.commit('setLoginStatus', 'logged_in')
      if (this.$router.currentRoute.query && this.$router.currentRoute.query.forward) {
        window.location.replace(this.$router.currentRoute.query.forward)
      }
      break
    case 'multifactor':
      context.commit('setLoginStatus', 'multifactor')
      break
  }
  // ping(context)
  return response
  */
}

export /* async */ function selectFolder (context, subfolder) {
  context.commit('folderDescription', '')
  context.commit('player', false)
  const route = { path: '/library', query: { folder: subfolder.path } }
  if (context.state.currentCollection > 0) {
    route.query.collection = context.state.currentCollection
  }
  this.app.router.push(route)
}

export async function fetchFolder (context, name = '') {
  // console.log(VueCookies.get('audioserve_token'))
  const folder = await fetch(context.getters.getServerUrl + 'folder/' + name, fetchOptions(context))

  if (folder.status === 401) {
    context.commit('loginStatus', false)
    return false
  }

  const json = await folder.json()
  if (json) {
    if (json.files.length > 0) {
      console.log('check if files are cached')
      json.files = await fileList(context, json.files)

      console.log(json)
    }
    context.commit('folder', json)
  }
}

export async function fileList (context, files) {
  files.forEach(async (file) => {
    const path = context.rootGetters['app/getFileUrl'](file.path)
    const filedetails = {
      hash: context.state.book.hash,
      file: path
    }
    file.isCached = await fileIsCached(context, filedetails)
  })
  return await files
}

export async function fetchCollections (context) {
  const collections = await fetch(context.state.server + 'collections', fetchOptions(context))
  return collections.json()
}

export async function getFolderDescription (context, path) {
  const description = await getDescription(context, path)
  context.commit('folderDescription', description)
}

export async function getBookDetails (context, hash) {
  const bookKey = 'book-' + context.state.group + '-' + hash
  let book = await localForage.getItem(bookKey)
  if (!book) {
    let description = null
    if (context.state.folder.description && context.state.folder.description.path) {
      description = await getDescription(context, context.state.folder.description.path)
    }
    let cover = null
    if (context.state.folder.cover) {
      cover = context.state.server + 'cover/' + context.state.folder.cover.path
    }

    book = {
      hash,
      name: 'Unknown',
      author: 'Unknown',
      description,
      cover,
      seek: 0,
      path: this.app.router.app.$route.query.folder,
      history: [],
      bookmarks: []
    }
    await localForage.setItem(bookKey, book)
  }

  context.commit('book', book)
}
export async function resetBook (context) {
  await context.dispatch('updateBookDetails', {
    seek: 0
  })
  context.commit('player/currentFile', {
    index: 0,
    start: 0,
    duration: context.rootState.player.files[0].meta.duration,
    path: context.rootState.player.files[0].path
  }, { root: true })
  context.commit('player/current', null, { root: true })
}
export async function updateBookDetails (context, updates) {
  const bookKey = 'book-' + context.state.group + '-' + context.state.book.hash
  const currentbook = context.state.book
  const book = {
    ...currentbook,
    ...updates
  }
  await localForage.setItem(bookKey, book)
  context.commit('book', book)
}

export async function setBookDetails (context, book) {
  const bookKey = 'book-' + context.state.group + '-' + book.hash
  await localForage.setItem(bookKey, book)
  context.commit('book', book)
}

export async function getDescription (context, path) {
  const description = context.state.server + 'desc/' + path
  const response = await fetch(description, fetchOptions(context))
  // console.log(response)
  // console.log(response.headers.get('Content-Type'))

  const mime = response.headers.get('Content-Type')
  const data = await response.text()
  // console.log(data)
  let output = ''
  let para = ''
  if (mime === 'text/html') {
    output = data
  } else if (mime === 'text/x-markdown' || mime === 'text/markdown') {
    output = marked(data)
  } else if (mime === 'text/plain') {
    const lines = data.split(/\r?\n/)
    for (const line of lines) {
      para += '<p>' + line + '</p>'
    }
    output = para
  } else {
    output = response.data
  }
  return output
}

export async function fileIsCached (context, details) {
  if (!('caches' in window)) {
    return false
  }
  const cacheName = context.state.cacheKey + details.hash
  const exists = await caches.has(cacheName)
  // console.log('exists')
  // console.log(exists)
  // console.log(cacheName)
  if (exists) {
    const cacheStorage = await caches.open(cacheName)
    const cachedResponse = await cacheStorage.match(details.file)
    // console.log(cachedResponse)
    return (cachedResponse !== undefined)
  }
  return false
}

export async function cachedBooks (context) {
  if (!('caches' in window)) {
    return []
  }
  context.commit('clearCachedBooks')
  const keys = await caches.keys()
  if (keys) {
    keys.forEach(async (key) => {
      const name = key.replace(context.state.cacheKey, '')
      key = 'book-' + context.state.group + '-' + name
      const book = await localForage.getItem(key)
      if (book) {
        context.commit('addCachedBook', book)
      }
    })
  }

  console.log(keys)
  return []
}

export function contentToExtension (mime) {
  let extension = 'mp3'
  switch (mime) {
    case 'audio/aac': extension = 'aac'; break
    case 'audio/mpeg': extension = 'mp3'; break
    case 'video/mp4': extension = 'mp4'; break
    case 'audio/ogg': extension = 'oga'; break
    case 'audio/opus': extension = 'opus'; break
    case 'audio/wav': extension = 'wav'; break
    case 'audio/webm': extension = 'weba'; break
    case 'audio/3gpp': extension = '3gp'; break
    case 'audio/3gpp2': extension = '3g2'; break
  }
  return extension
}

export function fetchOptions (context) {
  const audioserveToken = VueCookies.get('audioserve_token')

  if (audioserveToken !== null) {
    return {
      credentials: 'include',
      headers: {
        Authorization: 'Bearer ' + audioserveToken
      }
    }
  }
  return {}
}

export async function getCachedFile (context, details) {
  const cacheName = context.state.cacheKey + details.hash
  const cacheStorage = await caches.open(cacheName)
  const cachedResponse = await cacheStorage.match(details.file)
  let url = null
  if (cachedResponse !== undefined) {
    const blob = await cachedResponse.blob()
    url = URL.createObjectURL(blob)
  }
  // const re = /(?:\.([^.]+))?$/
  const extension = contentToExtension(cachedResponse.headers.get('content-type'))

  return {
    src: url,
    // format: re.exec(cachedResponse.url)[1]
    format: extension
  }
}

export async function cacheFile (context, details) {
  const cacheName = context.state.cacheKey + details.hash
  const cacheStorage = await caches.open(cacheName)
  // await cacheStorage.add(details.file)
  const response = await fetch(details.file, fetchOptions(context))
  console.log(response)
  const response2 = response.clone()
  cacheStorage.put(details.file, response)
  return response2
}

export async function tempCache (context, details) {
  const alreadyCached = await fileIsCached(context, details)
  if (alreadyCached) {
    return getCachedFile(context, details)
  }
  const response = await cacheFile(context, details)

  // return getCachedFile(context, details)
  let url = null
  if (response !== undefined) {
    const blob = await response.blob()
    url = URL.createObjectURL(blob)
  }
  // const re = /(?:\.([^.]+))?$/
  const extension = contentToExtension(response.headers.get('content-type'))

  return {
    src: url,
    // format: re.exec(response.url)[1]
    format: extension
  }
}

export async function initialiseApp (context) {
  const server = await localForage.getItem('server')
  const group = await localForage.getItem('group')
  const loginStatus = await localForage.getItem('loginStatus')
  const collections = await localForage.getItem('collections')
  const currentCollection = await localForage.getItem('currentCollection')
  if (server) {
    context.commit('server', server)
  }
  if (group) {
    context.commit('group', group)
  }
  if (loginStatus) {
    context.commit('loginStatus', loginStatus)
  }
  if (collections) {
    context.commit('collections', collections)
  }
  if (currentCollection) {
    context.commit('currentCollection', currentCollection)
  }
}

export function savePlayEvent (context, seek) {
  const history = context.state.book.history.length > 0 ? JSON.parse(JSON.stringify(context.state.book.history)) : []
  history.push({
    start: Date.now(),
    startSeek: seek,
    finish: null,
    endSeek: null
  })
  updateBookDetails(context, {
    history
  })
}

export function savePauseEvent (context, seek) {
  const history = context.state.book.history.length > 0 ? JSON.parse(JSON.stringify(context.state.book.history)) : []
  history[history.length - 1].finish = Date.now()
  history[history.length - 1].endSeek = seek
  updateBookDetails(context, {
    seek,
    history
  })
}
export function selectHistoryItem (context, seek) {
  const history = JSON.parse(JSON.stringify(context.state.book.history))
  const last = history[history.length - 1].endSeek

  history.push({
    start: Date.now(),
    startSeek: last,
    finish: Date.now(),
    endSeek: seek
  })
  updateBookDetails(context, {
    history
  })
}

export function autoRewind (context) {
  const history = context.state.book.history
  if (history.length === 0) {
    return 0
  }
  const last = history[history.length - 1]
  let amount = (Date.now() - last.finish) / 1000 // get it in seconds
  amount = Math.floor(Math.log(amount * (amount / 2) * (amount / 3)))
  console.log(amount)
  if (amount < 2) {
    amount = 2
  }
  if (amount > context.rootState.player.current) {
    amount = context.rootState.player.current
  }
  return amount
}

export function addBookmark (context, data) {
  const bookmarks = context.state.book.bookmarks.length > 0 ? JSON.parse(JSON.stringify(context.state.book.bookmarks)) : []
  const name = data.name || 'Anonymous bookmark'
  bookmarks.push({
    added: Date.now(),
    seek: data.seek,
    name
  })
  updateBookDetails(context, {
    bookmarks
  })
}

export function deleteBookmark (context, index) {
  const bookmarks = JSON.parse(JSON.stringify(context.state.book.bookmarks)).reverse()
  bookmarks.splice(index, 1)
  bookmarks.reverse()
  updateBookDetails(context, {
    bookmarks
  })
}

export function addActiveBook (context) {
  const activeBooks = context.state.groupDetails.active_books.length > 0 ? JSON.parse(JSON.stringify(context.state.groupDetails.active_books)) : []
  const hash = context.state.book.hash
  console.log('activeBooks')
  console.log(activeBooks.includes(hash))
  if (activeBooks.includes(hash) === false) {
    activeBooks.push(hash)
    context.commit('groupDetails', {
      ...context.state.groupDetails,
      active_books: activeBooks
    })
    setGroupDetails(context)
  }
}

export function activeBooks (context) {
  console.log(context.state)
  console.log(context.state.groupDetails.active_books)
  const books = []
  context.state.groupDetails.active_books.forEach(async (hash) => {
    const bookKey = 'book-' + context.state.group + '-' + hash
    console.log(bookKey)
    const book = await localForage.getItem(bookKey)
    books.push(book)
  })
  return books
}
