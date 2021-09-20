<template>
  <div :class="{ dark: darkMode }" class="relative flex items-top min-h-screen bg-gray-200 dark:bg-gray-800 w-full overflow-hidden">
    <div class="flex flex-col items-top h-screen w-full">
      <Header />
      <div class="flex w-full relative h-screen border-t border-gray-100 dark:border-gray-750 lg:border-t-0">
        <Nav />
          <Nuxt />
        </div>
      <LoginStatus />
    </div>
    <div :class="{'-mr-96': rightbar === false, 'translate-x-full': rightbar === false}" class="transform transition-all border-l h-screen border-gray-300 dark:border-gray-900 w-full max-w-sm z-20 items-top absolute lg:relative inset-0 flex bg-gray-100 dark:bg-gray-840 flex-col">
      <folder-details v-if="folder !== null && folder.files && folder.files.length === 0" :server="server" :details="folder" :name="foldername" />
      <book-details
        v-if="folder !== null && folder.files && folder.files.length > 0"
        :server="server"
        :details="folder"
        :name="foldername" />
    </div>
    <div :class="{'translate-y-full': player === false}" class="transition-all transform absolute right-0 border-l h-screen border-gray-300 dark:border-gray-900 w-full max-w-sm items-top z-30 flex flex-col">
      <player v-if="folder !== null && player !== false" :server="server" :details="folder" />
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
  mounted () {
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
    player () {
      return this.$store.state.app.player
    },
    darkMode () {
      return this.$store.state.app.groupDetails.darkMode
    }
  }

}
</script>
