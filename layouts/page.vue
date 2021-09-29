<template>
  <div :class="{ dark: darkMode }" class="relative flex items-top min-h-screen bg-gray-200 dark:bg-gray-800 w-full overflow-hidden">
    <div class="flex flex-col items-top h-screen w-full">
      <Header />
      <div class="flex w-full h-screen relative pt-safe pb-safe">
        <Nav />
          <Nuxt />
        </div>
      <LoginStatus />
    </div>
    <div :class="{'-mr-96': rightbar === false, 'translate-x-full': rightbar === false}" class="transform transition-all border-l h-screen border-gray-300 dark:border-gray-900 w-full max-w-sm z-20 items-top absolute lg:relative inset-0 flex bg-gray-100 dark:bg-gray-840 flex-col pt-safe pb-safe">
      <folder-details v-if="folder !== null && folder.files && folder.files.length === 0" :server="server" :details="folder" :name="foldername" />
      <book-details
        v-if="folder !== null && folder.files && folder.files.length > 0"
        :server="server"
        :details="folder"
        :name="foldername" />
    </div>
    <div :class="{'translate-y-full': showplayer === false}" class="transition-all transform absolute right-0 border-l h-screen border-gray-300 dark:border-gray-900 w-full max-w-sm items-top z-50 flex flex-col">
      <player v-if="folder !== null && showplayer !== false" :server="server" :details="folder" />
    </div>
  </div>
</template>

<script>

export default {
  name: 'Layout',
  data () {
    return {
      foldername: ''
    }
  },
  components: {
  },
  watch: {
    async loginStatus (to, from) {
      console.log('login status updated')
      if (to !== from) {
        if (to !== false) {
          if (this.$route.query.collection > 0) {
            this.$store.commit('app/currentCollection', this.$route.query.collection)
          } else {
            this.$store.commit('app/currentCollection', 0)
          }
          await this.$store.dispatch('app/fetchFolder', this.currentFolder)
          // Check if group details is set in storage
          this.$store.dispatch('app/getGroupDetails')
        }
      }
    },
    darkMode: {
      handler (to, from) {
        if (to !== from) {
          this.$colorMode.preference = (to) ? 'dark' : 'light'
          this.$colorMode.value = (to) ? 'dark' : 'light'
        }
      },
      immediate: true
    },
    $route: {
      handler (to, from) {
        if (to !== from) {
          this.$store.commit('app/menu', false)
        }
      },
      immediate: true
    }
  },
  async mounted () {
    await this.$store.dispatch('app/initialiseApp')

    const that = this
    this.player.onload = (event) => {
      that.$store.commit('player/loading', false)
    }
    this.player.onplay = (event) => {
      that.$store.commit('player/playing', true)
      that.player.playbackRate = that.groupDetails.playback_speed
      that.updatePlayerDetails()
      this.$store.dispatch('app/addActiveBook')
    }
    this.player.onpause = (event) => {
      this.$store.commit('player/playing', false)
    }
    this.player.onended = (event) => {
      console.log('track ended')
      that.nextTrack()
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
    location () {
      return this.$store.state.app.location
    },
    rightbar () {
      return this.$store.state.app.rightbar
    },
    showplayer () {
      return this.$store.state.app.player
    },
    player () {
      return this.$store.state.player.player
    },
    currentFile () {
      return this.$store.state.player.currentFile
    },
    playing () {
      return this.$store.state.player.playing
    },
    darkMode () {
      return this.$store.state.app.groupDetails.darkMode
    },
    groupDetails () {
      return this.$store.state.app.groupDetails
    }
  },
  methods: {
    updatePlayerDetails (current, last = 0) {
      const that = this
      const now = Date.now()
      if (now > last + 1000) {
        last = now
        that.$store.commit('player/current', current || that.player.currentTime)
      }
      if (this.playing === true) {
        window.requestAnimationFrame(function () {
          that.updatePlayerDetails(current, last)
        })
      }
    },
    async nextTrack () {
      if (this.currentFile.index + 1 >= this.folder.files.length) {
        await this.$store.dispatch('app/resetBook')
        return null
      }
      await this.$store.dispatch('app/updateBookDetails', {
        seek: this.currentFile.start + this.currentFile.duration
      })

      await this.$store.dispatch('player/load')
      await this.player.play()
    }
  }

}
</script>
