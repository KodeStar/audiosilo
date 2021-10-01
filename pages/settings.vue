<template>
  <div class="p-16 lg:p-3 px-6 lg:px-12 w-screen lg:w-full content-area overflow-auto lg:mr-4">
    <div class=""><span class="bg-pink-600 inline-block px-3 p-1 rounded text-white">Version: <span class="">{{ $config.clientVersion }}</span></span></div>
    <h2 class="my-6 text-xl font-semibold">Player Settings</h2>
    <div class="bg-gray-50 dark:bg-gray-840 rounded-lg border border-gray-300 dark:border-gray-860 text-sm">
      <div class="p-4 flex flex-col lg:flex-row justify-between items-center border-b border-gray-200 dark:border-gray-800">
        <div class="flex flex-col mb-4 lg:mb-0">
          <span class="font-semibold mb-1">Skip forwards amount (seconds)</span>
          <span class="">This controls how many seconds to skip the book forward when clicking on the button in the player.</span>
        </div>
        <div class="w-full max-w-xs"><input v-model="seekForwards" class="w-full p-3 bg-gray-100 dark:bg-gray-860 border border-gray-300 dark:border-gray-900 shadow-inner leading-normal rounded-xl" /></div>
      </div>
      <div class="p-4 flex flex-col lg:flex-row justify-between items-center border-b border-gray-200 dark:border-gray-800">
        <div class="flex flex-col mb-4 lg:mb-0">
          <span class="font-semibold mb-1">Skip backwards amount (seconds)</span>
          <span class="">This controls how many seconds to skip the book forward when clicking on the button in the player.</span>
        </div>
        <div class="w-full max-w-xs"><input v-model="seekBackwards" class="w-full p-3 bg-gray-100 dark:bg-gray-860 border border-gray-300 dark:border-gray-900 shadow-inner leading-normal rounded-xl" /></div>
      </div>
      <div class="p-4 flex flex-col lg:flex-row justify-between items-center border-b border-gray-200 dark:border-gray-800">
        <div class="flex flex-col mb-4 lg:mb-0">
          <span class="font-semibold mb-1">Playback speed</span>
          <span class="">Playback speed allows you to increase (or decrease) the amount of time it takes to listen to a book, without changing the pitch.</span>
        </div>
        <div class="w-full max-w-xs"><input v-model="playback_speed" class="w-full p-3 bg-gray-100 dark:bg-gray-860 border border-gray-300 dark:border-gray-900 shadow-inner leading-normal rounded-xl" /></div>
      </div>
      <div class="p-4 flex flex-col lg:flex-row justify-between items-center border-b border-gray-200 dark:border-gray-800">
        <div class="flex flex-col mb-4 lg:mb-0">
          <span class="font-semibold mb-1">Transcode</span>
          <span class="">Enabling transcoding will transcode audio files to the opus format in order to save bandwidth while keeping an acceptable sound quality but may result in slower downloads.</span>
        </div>
        <div class="w-full max-w-xs">
          <select v-model="transcode" class="w-full p-3 bg-gray-100 dark:bg-gray-860 border border-gray-300 dark:border-gray-900 shadow-inner leading-normal rounded-xl">
            <option v-for="(option, index) in options" :key="index" v-bind:value="option.value">
              {{ option.text }}
            </option>
          </select>
        </div>
      </div>
      <div class="p-4 flex flex-col lg:flex-row justify-between items-center border-b border-gray-200 dark:border-gray-800">
        <div class="flex flex-col mb-4 lg:mb-0">
          <span class="font-semibold mb-1">Theme</span>
          <span class="">Pick whether you would prefer light mode or dark mode</span>
        </div>
        <div class="w-full max-w-xs">
          <select v-model="darkMode" class="w-full p-3 bg-gray-100 dark:bg-gray-860 border border-gray-300 dark:border-gray-900 shadow-inner leading-normal rounded-xl">
            <option :value="false">Light mode</option>
            <option :value="true">Dark mode</option>
          </select>
        </div>
      </div>
      <div class="p-4 flex flex-col lg:flex-row justify-between items-center border-b border-gray-200 dark:border-gray-800">
        <div class="flex flex-col mb-4 lg:mb-0">
          <span class="font-semibold mb-1">Shake to cancel sleep timer</span>
          <span class="">Grant permission to devicemotion in order to allow shake to wake on the sleep timer</span>
        </div>
        <div class="w-full max-w-xs"><button @click="grantPermission">Grant Permission</button></div>
      </div>

    </div>
    <div class="lg:flex cursor-pointer border border-gray-300 dark:border-gray-900 items-center p-5 px-10 " @click="logout">
      <i class="fa-light fa-fw fa-right-from-bracket mr-2 fa-lg"></i>
      Logout
    </div>
    <div class="lg:flex cursor-pointer border border-gray-300 dark:border-gray-900 items-center p-5 px-10 " @click="logout">
      <i class="fa-light fa-fw fa-right-from-bracket mr-2 fa-lg"></i>
      Grant devicemotion permission in order to shake
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
      options: [
        { text: 'Disabled', value: '0' },
        { text: 'High (64kbps)', value: 'h' },
        { text: 'Medium (48kbps)', value: 'm' },
        { text: 'Low (24kbps)', value: 'l' }
      ]
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
        this.$store.dispatch('app/setGroupDetails')
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
        this.$store.dispatch('app/setGroupDetails')
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
        this.$store.dispatch('app/setGroupDetails')
      }
    },
    transcode: {
      get () {
        return this.$store.state.app.groupDetails.transcode
      },
      set (value) {
        const current = this.$store.state.app.groupDetails
        const newdetails = {
          ...current,
          transcode: value
        }
        this.$store.commit('app/groupDetails', newdetails)
        this.$store.dispatch('app/setGroupDetails')
      }
    },
    darkMode: {
      get () {
        return this.$store.state.app.groupDetails.darkMode
      },
      set (value) {
        const current = this.$store.state.app.groupDetails
        const newdetails = {
          ...current,
          darkMode: value
        }
        this.$store.commit('app/groupDetails', newdetails)
        this.$store.dispatch('app/setGroupDetails')
      }
    }
  },

  watch: {
  },

  mounted () {
    this.$store.commit('app/activepage', 'settings')
    this.$store.commit('app/resetFolder')
  },

  methods: {
    logout () {
      this.$store.commit('app/loginStatus', false)
    },
    grantPermission () {
      console.log('permission clicked')
      if (typeof DeviceMotionEvent.requestPermission === 'function') {
        console.log('DeviceMotionEvent exists')
        DeviceMotionEvent.requestPermission()
          .then((permissionState) => {
            if (permissionState === 'granted') {
              this.$store.commit('app/grantdevicemotion', true)
            }
          })
          .catch(console.error)
      } else {
        // handle regular non iOS 13+ devices
      }
    }
  }
}
</script>
