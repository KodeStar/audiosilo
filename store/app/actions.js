import axios from 'axios'
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
