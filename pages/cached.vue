<template>
  <div class="relative flex items-top min-h-screen bg-gray-200 w-full overflow-hidden">
    <div class="flex flex-col items-top h-screen w-full">
      <Header />
      <div class="flex w-full relative h-screen">
        <Nav />
        <div class="p-3 px-6 lg:px-12 w-screen lg:w-full content-area overflow-auto">
          <h2 class="my-6 text-xl font-bold text-gray-600">Cached Books</h2>
        </div>
      </div>
      <LoginStatus />
    </div>
  </div>
</template>

<script>
import LoginStatus from '~/components/LoginStatus.vue'

export default {
  name: 'Cached',
  components: {
    LoginStatus
  },
  data () {
    return {
    }
  },

  computed: {
    loginStatus () {
      return this.$store.state.app.loginStatus
    },
    server () {
      return this.$store.state.app.server
    }
  },

  watch: {
  },

  mounted () {
    this.$store.dispatch('app/initialiseApp')
    this.$store.commit('app/activepage', 'cached')
  },

  methods: {
  }
}
</script>
