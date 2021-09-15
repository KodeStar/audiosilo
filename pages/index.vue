<template>
  <div class="relative flex items-top min-h-screen bg-gray-200 w-full overflow-hidden">
    <div class="flex flex-col items-top h-screen w-full">
      <Header />
      <div class="flex w-full relative h-screen">
        <Nav />
        <div class="p-3 px-6 lg:px-12 w-screen lg:w-full content-area overflow-auto">
          <div v-if="folder && folder.subfolders">
            <div
              v-if="folder.subfolders.length > 0"
              class="my-6 text-xl font-bold text-gray-600"
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
              class="bg-gray-50 filter drop-shadow p-5 rounded-lg my-2 w-full text-gray-600 max-w-xl cursor-pointer"
              @click="selectFolder(subfolder)"
            >
              <i class="fa-light fa-folder mr-2 fa-lg" />
              {{ subfolder.name }}
            </div>
          </div>
          <div v-if="folder && folder.files">
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
              class="bg-gray-50 filter drop-shadow p-5 rounded-lg my-2 w-full text-gray-600 max-w-xl cursor-pointer"
              @click="selectFile(file)"
            >
              <svg
                aria-hidden="true"
                focusable="false"
                data-prefix="fal"
                data-icon="book"
                class="svg-inline--fa fa-book mr-2 fa-lg"
                role="img"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 448 512"><path fill="currentColor" d="M448 368v-320C448 21.49 426.5 0 400 0h-320C35.82 0 0 35.82 0 80V448c0 35.35 28.65 64 64 64h368c8.844 0 16-7.156 16-16S440.8 480 432 480H416v-66.95C434.6 406.4 448 388.8 448 368zM32 80C32 53.49 53.49 32 80 32H96v352H64c-11.71 0-22.55 3.389-32 8.9V80zM384 480H64c-17.64 0-32-14.36-32-32s14.36-32 32-32h320V480zM400 384H128V32h272C408.8 32 416 39.17 416 48v320C416 376.8 408.8 384 400 384zM352 128H192C183.2 128 176 135.2 176 144S183.2 160 192 160h160c8.844 0 16-7.156 16-16S360.8 128 352 128zM352 224H192C183.2 224 176 231.2 176 240S183.2 256 192 256h160c8.844 0 16-7.156 16-16S360.8 224 352 224z"></path></svg>
              {{ file.name }}
            </div>
          </div>
        </div>
      </div>
      <LoginStatus />
    </div>
    <div :class="{'-mr-96': rightbar === false, 'translate-x-full': rightbar === false}" class="transform transition-all border-l h-screen border-gray-300 w-full max-w-sm items-top absolute lg:relative inset-0 flex bg-gray-100 flex-col">
      <folder-details v-if="folder !== null && folder.files && folder.files.length === 0" :server="server" :details="folder" :name="foldername" />
      <book-details
        v-if="folder !== null && folder.files && folder.files.length > 0"
        :server="server"
        :details="folder"
        :name="foldername" />
    </div>
    <div :class="{'translate-y-full': player === false}" class="transition-all transform absolute right-0 border-l h-screen border-gray-300 w-full max-w-sm items-top flex flex-col">
      <player v-if="folder !== null && player !== false" :server="server" :details="folder" />
    </div>
  </div>
</template>

<script>
import VueCookies from 'vue-cookies'
import FolderDetails from '../components/FolderDetails'
import Player from '~/components/Player.vue'
import Header from '~/components/Header.vue'
import Nav from '~/components/Nav.vue'
import LoginStatus from '~/components/LoginStatus.vue'

export default {
  name: 'App',
  components: {
    Header,
    Nav,
    FolderDetails,
    Player,
    LoginStatus
  },
  data () {
    return {
      foldername: '',
      corsproxy: '',
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
    group () {
      return this.$store.state.app.group
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
    this.$store.commit('app/activepage', 'library')
    this.fetchFolder()
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

      if (folder.status === 401) {
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
    }
  }
}
</script>
