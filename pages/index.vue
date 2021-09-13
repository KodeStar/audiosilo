<template>
  <div class="relative flex items-top min-h-screen bg-gray-100 w-full overflow-hidden">
    <div class="flex flex-col items-top h-screen w-full">
      <div class="flex items-center w-full h-20 lg:h-28 border-b border-gray-200 lg:border-b-0 border-gray-200 relative">
        <div class="lg:w-80 flex-shrink-0 flex-grow-0 border-r lg:border-b p-3 px-10 h-20 flex items-center">
          <NuxtLink class="flex items-center" to="/">
            <i class="fa-light fa-computer-speaker fa-2xl mr-2" />
            <div class="flex flex-col">
              <div class="font-normal uppercase text-pink-600 leading-none">
                Audio<span class="font-semibold text-gray-500">Serve</span>
              </div>
              <div class="leading-none text-xs text-gray-400">
                {{ group }}
              </div>
            </div>
          </NuxtLink>
        </div>
        <div :class="{ mobilesearch: search, flex: search }" class="px-0 px-12 w-full items-center">
          <floating-label-input :class="{ block: search, hidden: !search }" v-model="searchterm" title="Search..." />
          <div class="ml-3">
          <div @click="search = false" :class="{ flex: search, hidden: !search }" class="rounded-full bg-gray-300 w-8 h-8 justify-center items-center"><i class="fa-thin fa-times fa-fw" /></div>
          </div>
          <div :class="{ hidden: search }" class="flex lg:hidden justify-end text-lg mr-1">
            <div @click="search = true" class="bg-gray-100 rounded w-10 h-10 flex justify-center items-center mx-1">
              <i class="fa-thin fa-magnifying-glass" />
            </div>
            <div @click="menu = !menu" class="bg-gray-100 rounded w-10 h-10 flex justify-center items-center mx-1">
              <i class="fa-thin fa-bars" />
            </div>
          </div>
        </div>
      </div>
      <div class="flex w-full relative">
        <div :class="{ '-translate-x-full': !menu, 'translate-x-0': menu }" class="transition-all z-40 bg-gray-100 flex-shrink-0 flex-grow-0 w-screen transform lg:translate-x-0 lg:w-80 p-8 px-6 min-h-screen border-r border-gray-200 absolute inset-0 lg:relative">
          <div v-if="collections.length > 1" class="relative border border-gray-100 rounded-2xl appearance-none -mt-8 -mx-6 max-w-xl flex-grow">
            <select :value="currentCollection" @change="changeCollection" class="w-full py-1 px-10 bg-gray-200 text-sm leading-normal max-w-xl">
              <option v-for="(option,index) in collections" :key="index" v-bind:value="index">
                {{ option }}
              </option>
            </select>
          </div>

          <NuxtLink class="flex items-center my-2 p-3 px-5" to="/">
            <i class="fa-light fa-rectangle-vertical-history mr-2 fa-lg"></i>
            Library
          </NuxtLink>
          <NuxtLink class="flex items-center my-2 p-3 px-5" to="/">
            <i class="fa-light fa-gear mr-2 fa-lg" />
            Settings
          </NuxtLink>
          <NuxtLink class="flex items-center my-2 p-3 px-5" to="/">
            <i class="fa-light fa-box-archive mr-2 fa-lg"></i>
            Cached
          </NuxtLink>
          <div class="flex items-center my-2 p-3 px-5" @click="logout">
            <i class="fa-light fa-right-from-bracket mr-2 fa-lg"></i>
            Logout
          </div>
        </div>
        <div class="p-3 px-12 w-screen lg:w-full content-area overflow-auto">
          <template v-if="folder && folder.subfolders">
            <div
              v-if="folder.subfolders.length > 0"
              class="mt-8 text-xl font-bold text-gray-600"
            >
              Folders
              <div v-if="breadcrumbs.length > 1" class="breadcrumbs flex-col lg:flex-row">
                <span
                  v-for="(breadcrumb, index) in breadcrumbs"
                  :key="index"
                  :class="{active: breadcrumb.active }"
                  @click="selectFolder({ path: breadcrumb.link })"
                >
                  {{ breadcrumb.name }}
                </span>
              </div>
            </div>
            <div
              v-for="(subfolder, index) in folder.subfolders"
              :key="index"
              class="bg-white bg-opacity-90 filter drop-shadow p-5 rounded-lg my-2 w-full text-gray-600 max-w-xl cursor-pointer"
              @click="selectFolder(subfolder)"
            >
              <i class="fa-thin fa-folder mr-2 fa-lg" />
              {{ subfolder.name }}
            </div>
          </template>
          <template v-if="folder && folder.files">
            <div
              v-if="folder.files.length > 0"
              class="mt-8 text-xl font-bold text-gray-600"
            >
              Files
              <div v-if="breadcrumbs.length > 1" class="breadcrumbs flex-col lg:flex-row">
                <span
                  v-for="(breadcrumb, index) in breadcrumbs"
                  :key="index"
                  :class="{active: breadcrumb.active }"
                  @click="selectFolder({ path: breadcrumb.link })"
                >
                  {{ breadcrumb.name }}
                </span>
              </div>
            </div>
            <div
              v-for="(file, index) in folder.files"
              :key="index"
              class="bg-white bg-opacity-90 filter drop-shadow p-5 rounded-lg my-2 w-full max-w-xl cursor-pointer"
              @click="selectFile(file)"
            >
              <i class="fa-thin fa-file-audio mr-2 fa-lg" />
              {{ file.name }}
            </div>

          </template>
        </div>
      </div>
      <div v-if="loginStatus===false" class="fixed inset-0 bg-gray-900 bg-opacity-75 z-50 flex justify-center items-center">
        <div class="rounded-lg flex bg-gray-100 flex-col p-8 w-full max-w-md m-4">
          <div class="flex justify-center mb-5">
            <NuxtLink class="flex items-center" to="/">
              <i class="fa-light text-5xl fa-computer-speaker mr-2" />
              <div class="flex flex-col">
                <div class="uppercase text-pink-600 text-2xl leading-none">
                  Audio<span class="font-semibold text-gray-500">Serve</span>
                </div>
              </div>
            </NuxtLink>
          </div>
          <floating-label-input class="my-2" :value="server" @input="updateServer" title="Server" />
          <floating-label-input class="my-2" v-model="secret" title="Shared Secret" />
          <floating-label-input class="my-2" v-model="group" title="Group" />
          <button class="bg-pink-600 text-white w-full mt-3 p-3 rounded-xl text-lg" @click="login">
            Login
          </button>
        </div>
      </div>
    </div>
    <div :class="{'-mr-96': rightbar === false, 'translate-x-full': rightbar === false}" class="transform transition-all border-l h-screen border-gray-200 w-full max-w-sm items-top absolute lg:relative inset-0 flex sidebar flex-col">
      <folder-details v-if="folder !== null && folder.files && folder.files.length === 0" :server="server" :details="folder" :name="foldername" />
      <book-details
        v-if="folder !== null && folder.files && folder.files.length > 0"
        :server="server"
        :details="folder"
        :name="foldername" />
    </div>
    <div :class="{'translate-y-full': player === false}" class="transition-all transform absolute right-0 border-l h-screen border-gray-200 w-full max-w-sm items-top flex flex-col">
      <player v-if="folder !== null && player !== false" :server="server" :details="folder" />
    </div>
  </div>
</template>

<script>
import VueCookies from 'vue-cookies'
import FolderDetails from '../components/FolderDetails'
import FloatingLabelInput from '~/components/FloatingLabelInput.vue'
import Player from '~/components/Player.vue'

export default {
  name: 'App',
  components: {
    FolderDetails,
    FloatingLabelInput,
    Player
  },
  data () {
    return {
      group: 'Test',
      foldername: '',
      corsproxy: '',
      search: false,
      menu: false,
      searchterm: '',
      secret: ''
    }
  },

  computed: {
    currentFolder () {
      return this.$route.query.folder || ''
    },
    loginStatus () {
      return this.$store.state.app.loginStatus
    },
    server () {
      return this.$store.state.app.server
    },
    folder () {
      return this.$store.state.app.folder
    },
    rightbar () {
      return this.$store.state.app.rightbar
    },
    collections () {
      return this.$store.state.app.collections
    },
    currentCollection () {
      return this.$store.state.app.currentCollection
    },
    loginsecret () {
      return this.$store.state.app.loginsecret
    },
    player () {
      return this.$store.state.app.player
    },
    breadcrumbs () {
      const breadcrumbs = [{
        name: 'Home',
        link: '/',
        active: false
      }]
      if (this.$route.query.folder) {
        if (this.$route.query.folder !== '/') {
          const segments = this.$route.query.folder.split('/')
          for (let i = 0; i < segments.length; i++) {
            breadcrumbs.push({
              name: segments[i],
              link: segments.slice(0, i + 1).join('/'),
              active: (i === segments.length - 1)
            })
          }
        }
      }
      return breadcrumbs
    }
  },

  watch: {
    '$route' (to, from) {
      console.log('watch route triggered')
      if (to !== from) {
        if (to.query.collection > 0) {
          this.$store.commit('app/currentCollection', to.query.collection)
        } else {
          this.$store.commit('app/currentCollection', 0)
        }

        if (to.query.folder) {
          this.fetchFolder(to.query.folder)
        } else {
          this.fetchFolder()
        }
      }
    },
    loginStatus (to, from) {
      console.log('login status updated')
      if (to !== from) {
        if (to !== false) {
          if (this.$route.query.collection > 0) {
            this.$store.commit('app/currentCollection', this.$route.query.collection)
          } else {
            this.$store.commit('app/currentCollection', 0)
          }
          this.fetchFolder(this.currentFolder)
        }
      }
    },
    currentCollection (to, from) {
      if (to !== from) {
        this.selectFolder({ path: '/' })
      }
    }
  },

  mounted () {
    this.$store.dispatch('app/initialiseApp')
    // this.fetchFolder()
  },

  methods: {
    async fetchFolder (name = '') {
      // console.log(VueCookies.get('audioserve_token'))
      const folder = await fetch(this.$store.getters['app/getServerUrl'] + 'folder/' + name, {
        headers: {
          Authorization: 'Bearer ' + VueCookies.get('audioserve_token')
        }
      })

      if (folder.status !== 200) {
        this.$store.commit('app/loginStatus', false)
        return false
      }

      const json = await folder.json()
      if (json) {
        this.$store.commit('app/folder', json)
      }
    },
    changeCollection (event) {
      this.$store.commit('app/currentCollection', event.target.value)
    },
    updateServer (input) {
      this.$store.commit('app/server', input)
    },
    selectFolder (subfolder) {
      this.$store.commit('app/folderDescription', '')
      this.$store.commit('app/player', false)
      const route = { path: '/', query: { folder: subfolder.path } }
      if (this.currentCollection > 0) {
        route.query.collection = this.currentCollection
      }
      this.$router.push(route)
      this.fetchFolder(encodeURIComponent(subfolder.path))
      // this.$store.commit('app/rightbar', true)
    },
    logout () {
      this.$store.commit('app/loginStatus', false)
    },
    login () {
      this.$store.dispatch('app/login', {
        server: this.server,
        group: this.group,
        secret: this.secret
      })
    }
  }
}
</script>
