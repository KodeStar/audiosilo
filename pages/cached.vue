<template>
  <div class="p-3 px-6 lg:px-12 w-screen lg:w-full content-area overflow-auto lg:mr-4">
    <h2 class="my-6 text-xl font-bold">Cached Books</h2>
    <div v-if="books.length > 0">
      <div class="flex flex-wrap">
        <div v-for="book in books" :key="book.hash" @click="$store.dispatch('app/selectFolder', book)" class="flex m-3 flex-col cursor-pointer">

          <div class="text w-60 h-60 flex justify-center flex-shrink">
            <div class="w-full relative cover-container bg-gray-300 dark:bg-gray-800 justify-center flex items-center rounded-md shadow-inner">
              <Cover :image="book.cover" :path="book.path" />
            </div>
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
    this.$store.commit('app/activepage', 'cached')
    this.$store.dispatch('app/cachedBooks')
  },

  methods: {
  }
}
</script>
