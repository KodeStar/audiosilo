<template>
  <div class="relative flex items-top min-h-screen bg-gray-100 w-full overflow-hidden">
    <div class="flex flex-col items-top h-screen w-full">
      <Header />
      <div class="flex w-full relative h-screen">
        <Nav />
        <div class="p-3 px-12 w-screen lg:w-full content-area overflow-auto">
          Cached Items
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
  },

  methods: {
  }
}
</script>
