import axios from 'axios'
import marked from 'marked'
import { sha256 } from 'js-sha256'
import base64js from 'base64-js'

export async function firelogin (context, data) {
  const response = await axios.post(process.env.BACKEND_LOCATION + 'login', data)

  return response
}

export function setDetails (context, data) {
  localStorage.setItem('server', data.server)
  localStorage.setItem('group', data.group)
  localStorage.setItem('loginsecret', data.secret)
  localStorage.setItem('loginStatus', data.loginStatus)
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
    return digestPromise
      .then((s) => {
        const thesecret = base64js.fromByteArray(randomBytes) + '|' + base64js.fromByteArray(new Uint8Array(s))
        // console.log(thesecret)
        const bodyFormData = 'secret=' + thesecret
        axios.$post(data.corsproxy + data.server + 'authenticate', bodyFormData, { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } }).then((response) => {
          // console.log(response)
          loginsecret = response
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
    loginsecret,
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

export async function getFolderDescription (context, path) {
  const description = await getDescription(context, path)
  context.commit('folderDescription', description)
}

export async function getBookDetails (context, hash) {
  let book = await this.$localForage.getItem(hash)
  if (!book) {
    let description = null
    if (context.state.folder.description.path) {
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
      seek: 0
    }
    await this.$localForage.setItem(hash, book)
  }

  context.commit('book', book)
}

export async function updateBookDetails (context, item) {
  const currentbook = context.state.book
  const updates = item.book
  const book = {
    ...currentbook,
    ...updates
  }
  await this.$localForage.setItem(item.hash, book)
  context.commit('book', book)
}

export async function setBookDetails (context, book) {
  await this.$localForage.setItem(book.hash, book)
  context.commit('book', book)
}

export async function getDescription (context, path) {
  const description = context.state.server + 'desc/' + path
  const response = await axios.get(description)
  console.log(response)
  console.log(response.headers['content-type'])

  const mime = response.headers['content-type']
  let output = ''
  let para = ''
  if (mime === 'text/html') {
    output = response.data
  } else if (mime === 'text/x-markdown' || mime === 'text/markdown') {
    output = marked(response.data)
  } else if (mime === 'text/plain') {
    const lines = response.data.split(/\r?\n/)
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
  const cacheName = `audioserv-${details.hash}`
  const cacheStorage = await caches.open(cacheName)
  const cachedResponse = await cacheStorage.match(details.file)
  return (cachedResponse !== undefined)
}

export async function getCachedFile (context, details) {
  const cacheName = `audioserv-${details.hash}`
  const cacheStorage = await caches.open(cacheName)
  const cachedResponse = await cacheStorage.match(details.file)
  let url = null
  if (cachedResponse !== undefined) {
    const blob = await cachedResponse.blob()
    url = URL.createObjectURL(blob)
  }
  const re = /(?:\.([^.]+))?$/

  return {
    src: url,
    format: re.exec(cachedResponse.url)[1]
  }
}

export async function cacheFile (context, path) {

}
