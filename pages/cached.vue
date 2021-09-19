<template>
  <div class="p-3 px-6 lg:px-12 w-screen lg:w-full content-area overflow-auto lg:border-l border-gray-100">
    <h2 class="my-6 text-xl font-bold text-gray-600">Cached Books</h2>
    <div v-if="books.length > 0">
      <div class="flex flex-wrap">
        <div v-for="book in books" :key="book.hash" @click="$store.dispatch('app/selectFolder', book)" class="flex m-3 flex-col cursor-pointer">
          <div class="w-60 h-60 bg-gray-300 justify-center flex items-center rounded-md shadow-inner p-4">
            <Cover :image="book.cover" :path="book.path" />
          </div>
        </div>
      </div>
    </div>
    <div v-else>
      There are no books currently cached
    </div>
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
    },
    books () {
      return this.$store.state.app.groupDetails.cached_books
    }

  },

  watch: {
  },

  mounted () {
    this.$store.commit('app/rightbar', false)
    this.$store.dispatch('app/initialiseApp')
    this.$store.commit('app/activepage', 'cached')
    this.$store.dispatch('app/cachedBooks')
  },

  methods: {
  }
}
</script>
