<template>
  <div class="p-3 px-6 lg:px-12 w-screen lg:w-full content-area overflow-auto">
    <h2 class="my-6 text-xl font-bold text-gray-600">Player Settings</h2>
    <div class="bg-gray-50 rounded-lg border border-gray-300 text-sm">
      <div class="p-4 flex flex-col lg:flex-row justify-between items-center border-b">
        <div class="flex flex-col mb-4 lg:mb-0">
          <span class="font-bold mb-1">Skip forwards amount (seconds)</span>
          <span class="">This controls how many seconds to skip the book forward when clicking on the button in the player.</span>
        </div>
        <div class="w-full max-w-xs"><input v-model="seekForwards" class="w-full p-3 bg-gray-100 border border-gray-300 shadow-inner leading-normal rounded-xl" /></div>
      </div>
      <div class="p-4 flex flex-col lg:flex-row justify-between items-center border-b">
        <div class="flex flex-col mb-4 lg:mb-0">
          <span class="font-bold mb-1">Skip backwards amount (seconds)</span>
          <span class="">This controls how many seconds to skip the book forward when clicking on the button in the player.</span>
        </div>
        <div class="w-full max-w-xs"><input v-model="seekBackwards" class="w-full p-3 bg-gray-100 border border-gray-300 shadow-inner leading-normal rounded-xl" /></div>
      </div>
      <div class="p-4 flex flex-col lg:flex-row justify-between items-center border-b">
        <div class="flex flex-col mb-4 lg:mb-0">
          <span class="font-bold mb-1">Playback speed</span>
          <span class="">Playback speed allows you to increase (or decrease) the amount of time it takes to listen to a book, without changing the pitch.</span>
        </div>
        <div class="w-full max-w-xs"><input v-model="playback_speed" class="w-full p-3 bg-gray-100 border border-gray-300 shadow-inner leading-normal rounded-xl" /></div>
      </div>
    </div>
  </div>
</template>

<script>

export default {
  layout: 'page',
  name: 'App',
  components: {
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
    },
    seekForwards: {
      get () {
        return this.$store.state.app.groupDetails.seekForwards
      },
      set (value) {
        const current = this.$store.state.app.groupDetails
        const newdetails = {
          ...current,
          seekForwards: value
        }
        this.$store.commit('app/groupDetails', newdetails)
      }
    },
    seekBackwards: {
      get () {
        return this.$store.state.app.groupDetails.seekBackwards
      },
      set (value) {
        const current = this.$store.state.app.groupDetails
        const newdetails = {
          ...current,
          seekBackwards: value
        }
        this.$store.commit('app/groupDetails', newdetails)
      }
    },
    playback_speed: {
      get () {
        return this.$store.state.app.groupDetails.playback_speed
      },
      set (value) {
        const current = this.$store.state.app.groupDetails
        const newdetails = {
          ...current,
          playback_speed: value
        }
        this.$store.commit('app/groupDetails', newdetails)
      }
    }
  },

  watch: {
  },

  mounted () {
    this.$store.dispatch('app/initialiseApp')
    this.$store.commit('app/activepage', 'settings')
  },

  methods: {
  }
}
</script>
