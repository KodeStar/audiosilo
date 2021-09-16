<template>
  <div class="p-3 px-6 lg:px-12 w-screen lg:w-full content-area overflow-auto">
    <h2 class="my-6 text-xl font-bold text-gray-600">Cached Books</h2>
  </div>
</template>

<script>

export default {
  layout: 'page',
  name: 'Cached',
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
