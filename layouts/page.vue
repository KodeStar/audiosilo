<template>
  <div class="relative flex items-top min-h-screen bg-gray-200 w-full overflow-hidden">
    <div class="flex flex-col items-top h-screen w-full">
      <Header />
      <div class="flex w-full relative h-screen border-t border-gray-100 lg:border-t-0">
        <Nav />
          <Nuxt />
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

export default {
  name: 'Layout',
  data () {
    return {
      foldername: ''
    }
  },
  components: {
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
    }

  }

}
</script>
