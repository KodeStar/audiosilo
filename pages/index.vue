<template>
  <div class="my-16 lg:my-0 p-3 px-6 lg:px-12 w-screen lg:w-full content-area overflow-auto lg:mr-4">
    <h2 class="my-6 text-lg font-semibold">Continue reading</h2>
    <div v-if="active.length > 0">
      <div class="flex lg:flex-wrap overflow-x-scroll">
        <div v-for="book in active" :key="book.hash" @click="$store.dispatch('app/selectFolder', book)" class="flex m-1 flex-col cursor-pointer">

          <div class="text w-28 h-28 lg:w-48 lg:h-48 flex justify-center flex-shrink">
            <div class="w-full relative cover-container bg-gray-300 dark:bg-gray-860 justify-center flex items-center rounded-md shadow-inner">
              <Cover :mini="true" :image="book.cover" :path="book.path" />
            </div>
          </div>

        </div>
      </div>
    </div>
    <div v-else>
      You aren't currently listening to any books
    </div>
    <template v-if="cached.length > 0">
      <h2 class="my-6 text-lg font-semibold">Downloaded Books</h2>
      <div v-if="cached.length > 0">
        <div class="flex flex-wrap">
          <div v-for="book in cached" :key="book.hash" @click="$store.dispatch('app/selectFolder', book)" class="flex m-3 flex-col cursor-pointer">

            <div class="text w-28 h-28 lg:w-60 lg:h-60 flex justify-center flex-shrink">
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
    </template>
    <h2 class="my-6 text-lg font-semibold">Recently finished</h2>
    <div v-if="finished.length > 0">
      <div class="flex flex-wrap">
        <div v-for="book in finished" :key="book.hash" @click="$store.dispatch('app/selectFolder', book)" class="flex m-3 flex-col cursor-pointer">

          <div class="text w-28 h-28 lg:w-60 lg:h-60 flex justify-center flex-shrink">
            <div class="w-full relative cover-container bg-gray-300 dark:bg-gray-800 justify-center flex items-center rounded-md shadow-inner">
              <Cover :image="book.cover" :path="book.path" />
            </div>
          </div>

        </div>
      </div>
    </div>
    <div v-else>
      There are no books recently finished
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
      secret: '',
      active: []
    }
  },

  computed: {
    finished () {
      return this.$store.state.app.groupDetails.finished_books
    },
    cached () {
      return this.$store.state.app.groupDetails.cached_books
    },
    groupDetails () {
      return this.$store.state.app.groupDetails
    }
  },

  watch: {
    groupDetails: {
      handler (to, from) {
        if (to !== from) {
          this.getActiveBooks()
        }
      },
      immediate: true
    }
  },
  mounted () {
    this.$store.commit('app/rightbar', false)
    this.$store.commit('app/activepage', 'home')
    this.$store.dispatch('app/cachedBooks')
    // this.$store.dispatch('app/fetchFolder')
  },
  created () {
  },

  methods: {
    async getActiveBooks () {
      this.active = await this.$store.dispatch('app/activeBooks')
      console.log('active')
      console.log(this.active)
    }
  }
}
</script>
