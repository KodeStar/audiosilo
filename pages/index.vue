<template>
  <div class="p-3 px-6 lg:px-12 w-screen lg:w-full content-area overflow-auto lg:border-l border-gray-100">
    <div v-if="folder && folder.subfolders && folder.subfolders.length > 0">
      <BreadCrumbs />
      <div
        class="my-6 text-xl font-bold text-gray-600"
      >
        Folders
      </div>
      <div
        v-for="(subfolder, index) in folder.subfolders"
        :key="index"
        class="bg-gray-50 filter drop-shadow rounded-lg my-2 w-full flex text-gray-600 max-w-xl items-center cursor-pointer"
        @click="$store.dispatch('app/selectFolder', subfolder)"
      >
        <div class="p-4 flex self-stretch text-gray-50 bg-pink-600 rounded-l-lg">
          <i class="fa-light fa-fw fa-folder fa-lg" />
        </div>
        <div class="px-5 py-2">
          <span class="text-sm font-medium">{{ subfolder.name }}</span>
        </div>
      </div>
    </div>
    <div v-if="folder && folder.files && folder.files.length > 0">
      <BreadCrumbs />
      <div
        class="my-6 text-xl font-bold text-gray-600"
      >
        Files
      </div>
      <div
        v-for="(file, index) in folder.files"
        :key="index"
        class="bg-gray-50 min-h-[3.5rem] filter drop-shadow rounded-lg hover:opacity-80 my-2 w-full flex text-gray-600 max-w-xl items-center cursor-pointer"
        :class="{ 'opacity-50': (seek > 0 || current > 0 || currentFile.index > 0) && currentFile.index !== index }"
        @click="selectFile(index)"
      >
        <div class="p-4 flex self-stretch items-center text-gray-50 bg-blue-400 rounded-l-lg">
        <svg
          aria-hidden="true"
          focusable="false"
          data-prefix="fal"
          data-icon="book"
          class="svg-inline--fa fa-fw fa-book fa-lg"
          role="img"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 448 512"><path fill="currentColor" d="M448 368v-320C448 21.49 426.5 0 400 0h-320C35.82 0 0 35.82 0 80V448c0 35.35 28.65 64 64 64h368c8.844 0 16-7.156 16-16S440.8 480 432 480H416v-66.95C434.6 406.4 448 388.8 448 368zM32 80C32 53.49 53.49 32 80 32H96v352H64c-11.71 0-22.55 3.389-32 8.9V80zM384 480H64c-17.64 0-32-14.36-32-32s14.36-32 32-32h320V480zM400 384H128V32h272C408.8 32 416 39.17 416 48v320C416 376.8 408.8 384 400 384zM352 128H192C183.2 128 176 135.2 176 144S183.2 160 192 160h160c8.844 0 16-7.156 16-16S360.8 128 352 128zM352 224H192C183.2 224 176 231.2 176 240S183.2 256 192 256h160c8.844 0 16-7.156 16-16S360.8 224 352 224z"></path></svg>
        </div>
        <div class="flex justify-between w-full items-center">
          <div class="px-5 py-2 flex flex-col">
            <span class="text-sm font-medium">{{ file.name }}</span>
            <span class="text-xs text-gray-500"><span class="font-normal">Duration:</span> <span class="">{{ $formatToTime(file.meta.duration, 3, false) }}</span> <span class="ml-2 font-normal">Bitrate:</span> <span class="">{{ file.meta.bitrate }}</span>kbps</span>
          </div>
          <div class="px-4">
            <div class="w-4 h-4 rounded-full" :class="[ file.path === true ? 'bg-green-400' : 'bg-gray-200']"></div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  layout: 'page',
  name: 'App',
  transition: {
    name: 'page'
  },
  components: {
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
    currentFile () {
      return this.$store.state.player.currentFile
    },
    loginStatus () {
      return this.$store.state.app.loginStatus
    },
    server () {
      return this.$store.state.app.server
    },
    current () {
      return this.$store.state.player.current
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
      return this.$store.state.player.player
    },
    seek () {
      return this.$store.state.app.book.seek
    },
    playing () {
      return this.$store.state.player.playing
    },
    hash () {
      return this.$store.getters['app/hash'](this.$route.fullPath)
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
          this.$store.dispatch('app/fetchFolder', to.query.folder)
        } else {
          this.$store.dispatch('app/fetchFolder')
        }
      }
    },
    async currentCollection (to, from) {
      if (to !== from) {
        await this.$store.dispatch('app/selectFolder', { path: '/' })
      }
    }
  },

  mounted () {
    this.$store.dispatch('app/initialiseApp')
    this.$store.commit('app/activepage', 'library')
  },

  methods: {
    async selectFile (index) {
      if (index === this.currentFile.index) {
        if (this.playing) {
          return this.$store.commit('app/player', true)
        } else {
          await this.$store.dispatch('player/load')
          return this.player.play()
        }
      }
      // console.log('not current index')
      let start = 0
      if (index > 0) {
        const files = this.folder.files.slice(0, index)
        start = this.$store.getters['player/getStart'](files)
      }
      const data = {
        duration: this.folder.files[index].meta.duration,
        index,
        path: this.folder.files[index].path,
        start
      }
      this.$store.commit('player/currentFile', data)
      // this.$store.commit('player/loading', true)
      await this.$store.dispatch('player/load', {
        file: this.folder.files[index].path,
        seek: 0
      })
      this.player.play()
    },
    updateServer (input) {
      this.$store.commit('app/server', input)
    }
    /* async isCached (file) {
      const filedetails = {
        hash: this.hash,
        file: this.$store.getters['app/getFileUrl'](file.path)
      }
      const iscached = await this.$store.dispatch('app/fileIsCached', filedetails)
      console.log('iscached: ' + typeof iscached)
      return iscached
    } */
  }
}
</script>
