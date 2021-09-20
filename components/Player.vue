<template>
  <div class="flex flex-col justify-between relative bg-gray-100 dark:bg-gray-840 h-screen overflow-auto">
    <div @click="closePlayer" class="absolute top-0 right-0 w-8 h-8 rounded-bl flex cursor-pointer justify-center items-center"><i class="fa-thin fa-chevron-down"></i></div>
    <div>
      <div class="text p-8 pb-5 pt-12 flex justify-center flex-shrink">
        <div class="w-full cover-container bg-gray-300 dark:bg-gray-800 justify-center flex items-center rounded-md shadow-inner p-4">
          <Cover :image="image" :path="$route.query.folder" />
        </div>
      </div>
      <div class="w-full px-8 flex flex-col text-center items-center">
        <div class=" font-semibold flex mb-2">{{ chaptername }}</div>
        <!--<div class="text-sm text-gray-400 mb-2">{{ details.files[0].name }} - Artist name</div>-->
        <div class="flex py-1 items-center w-full relative mb-1">
          <div class="relative flex-grow mr-2">
            <div class="overflow-hidden h-1 text-xs flex rounded bg-gray-300">
              <div :style="{ width: localpercent + '%'}" class="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-pink-600"></div>
            </div>
          </div>
          <input
            type="range"
            min="0"
            :max="currentFile.duration"
            :value="current"
            @input="updateSeek"
            class="absolute playback-slider" />
        </div>

        <div class="flex w-full justify-between pointer-events-none">
          <div class="text-xs">{{ $formatToPlayback(current) }}</div>
          <div class="px-8 text-xs">{{ totalremaining }}</div>
          <div class="text-xs">-{{ $formatToPlayback(remaining) }}</div>
        </div>
      </div>
    </div>

    <div class="flex items-center w-full justify-evenly my-2">
      <div class="">
        <span  @click="seekBackwards" class="fa-layers fa-fw fa-3x relative">
          <i class="fa-thin fa-circle-notch fa-rotate-by" style="--fa-rotate-angle: -23deg;"></i>
          <i class="fa-solid fa-chevron-left" data-fa-transform="up-30" style="font-size: 12px;"></i>
          <span class="text-sm absolute inset-0 flex justify-center items-center" style="">{{ groupDetails.seekBackwards }}</span>
        </span>
      </div>
      <div class="cursor-pointer relative">
        <span v-show="!playing" @click="togglePlay" class="fa-layers fa-fw fa-6x">
          <i class="fa-solid text-pink-600 fa-circle"></i>
          <i class="fa-inverse fa-solid fa-play" data-fa-transform="shrink-10"></i>
        </span>
        <span v-show="playing" @click="togglePlay" class="fa-layers fa-fw fa-6x">
          <i class="fa-solid text-pink-600 fa-circle"></i>
          <i class="fa-inverse fa-solid fa-pause" data-fa-transform="shrink-10"></i>
        </span>
        <span v-show="loading" class="fa-layers fa-fw fa-6x absolute inset-0 opacity-70">
          <i class="fa-solid fa-circle"></i>
          <i class="fa-inverse fa-light fa-spinner-third fa-spin" data-fa-transform="shrink-2"></i>
        </span>
      </div>
      <div class="">
        <span @click="seekForwards" class="fa-layers fa-fw fa-3x relative">
          <i class="fa-thin fa-circle-notch fa-rotate-by" style="--fa-rotate-angle: 23deg;"></i>
          <i class="fa-solid fa-chevron-right" data-fa-transform="up-30" style="font-size: 12px;"></i>
          <span class="text-sm absolute inset-0 flex justify-center items-center" style="">{{ groupDetails.seekForwards }}</span>
        </span>
      </div>
    </div>
    <div class="p-2 w-full">
      <div class="bg-gray-200 dark:bg-gray-800 rounded p-3 px-6 w-full relative flex justify-between">
        <button @click="editPlaybackSpeed = true" class="cursor-pointer">{{ playbackSpeed }}x</button>
        <button class="cursor-pointer"><i class="fa-light fa-alarm-snooze"></i></button>
        <button class="cursor-pointer"><i class="fa-light fa-airplay"></i></button>
        <button class="cursor-pointer"><i class="fa-light fa-sliders-up"></i></button>
        <div v-if="editPlaybackSpeed" class="absolute inset-0 flex bg-gray-200 dark:bg-gray-800 rounded justify-between p-3 px-6">
          <span>{{ playbackSpeed }}x</span>
          <div class="flex items-center">
          <div @click="decreasePlaybackSpeed" class="mx-3 cursor-pointer"><i class="fa-solid fa-circle-minus fa-lg"></i></div>
          <div><input :value="playbackSpeed" @input="updatePlaybackSpeed" class="w-12 p-2 text-center" /></div>
          <div @click="increasePlaybackSpeed" class="mx-3 cursor-pointer"><i class="fa-solid fa-circle-plus fa-lg"></i></div>
          </div>
          <div @click="editPlaybackSpeed = false" class="cursor-pointer">Close</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Player',
  props: ['details', 'server'],
  data () {
    return {
      editPlaybackSpeed: false
    }
  },

  computed: {
    image () {
      return this.$store.state.app.book.cover
    },
    groupDetails () {
      return this.$store.state.app.groupDetails
    },
    playbackSpeed () {
      return Number.parseFloat(this.groupDetails.playback_speed).toFixed(2)
    },
    transcode () {
      return this.$store.state.app.transcode
    },
    seek () {
      return this.$store.state.app.book.seek
    },
    hash () {
      return this.$store.getters['app/hash'](this.$route.fullPath)
    },
    totalTime () {
      return 0
    },
    remaining () {
      return this.currentFile.duration - this.current
    },
    totalremaining () {
      const remaining = this.$store.getters['player/totalTime'] - this.currentFile.start - this.current
      return this.$formatToTime(remaining, 2, false) + ' remaining'
    },
    percent () {
      return 0
    },
    localpercent () {
      if (this.player) {
        const percent = (Math.ceil(this.remaining) / this.currentFile.duration) * 100
        return 100 - percent.toFixed(2)
      }
      return 0
    },
    currentFile () {
      return this.$store.state.player.currentFile
    },
    playing () {
      return this.$store.state.player.playing
    },
    current () {
      return this.$store.state.player.current
    },
    player () {
      return this.$store.state.player.player
    },
    loading () {
      return this.$store.state.player.loading
    },
    chaptername () {
      if (this.details.files && this.currentFile) {
        return this.details.files[this.currentFile.index].name
      }
      return 'Chapter 1'
    }
  },

  mounted () {
    // console.log('this.player.src')
    // console.log(this.player.src)
    /* if (this.player.src === '') {
      // this.$store.commit('player/loading', true)
      await this.$store.dispatch('player/load')
    } */
    const that = this
    this.player.onload = (event) => {
      that.$store.commit('player/loading', false)
    }
    this.player.onplay = (event) => {
      that.$store.commit('player/playing', true)
      that.updatePlayerDetails()
    }
    this.player.onpause = (event) => {
      this.$store.commit('player/playing', false)
      this.$store.dispatch('app/updateBookDetails', {
        seek: that.currentFile.start + that.current
      })
    }
    this.player.onended = (event) => {
      console.log('track ended')
      that.nextTrack()
    }
  },

  beforeDestroy () {
    console.log('clean up')
    // Delete any temp caches
    caches.delete(this.$store.state.app.cacheKey + 'temp-' + this.hash)
  },
  methods: {
    prevFile () {
      return {
        index: this.currentFile.index - 1,
        start: this.currentFile.start - this.currentFile.duration,
        duration: this.details.files[this.currentFile.index - 1].meta.duration,
        path: this.details.files[this.currentFile.index - 1].path
      }
    },

    nextFile () {
      return {
        index: this.currentFile.index + 1,
        start: this.currentFile.start + this.currentFile.duration,
        duration: this.details.files[this.currentFile.index + 1].meta.duration,
        path: this.details.files[this.currentFile.index + 1].path
      }
    },

    async nextTrack () {
      if (this.currentFile.index + 1 >= this.details.files.length) {
        await this.$store.dispatch('app/resetBook')
        return null
      }
      await this.$store.dispatch('app/updateBookDetails', {
        seek: this.currentFile.start + this.currentFile.duration
      })

      await this.$store.dispatch('player/load')
      await this.player.play()
    },

    async updateSeek (event) {
      if (this.playing) {
        await this.player.pause()
        this.player.currentTime = event.target.value
        this.$store.commit('player/current', event.target.value)
        await this.player.play()
      } else {
        this.player.currentTime = event.target.value
        this.$store.commit('player/current', event.target.value)
      }
    },
    async loadFile (file) {
    },
    updatePlayerDetails (current, last = 0) {
      const that = this
      const now = Date.now()
      if (now > last + 1000) {
        last = now
        that.$store.commit('player/current', current || that.player.currentTime)
      }
      if (this.playing === true) {
        window.requestAnimationFrame(function () {
          that.updatePlayerDetails(current, last)
        })
      }
    },
    closePlayer () {
      this.$store.commit('app/player', false)
    },
    togglePlay () {
      if (this.playing) {
        this.pause()
      } else {
        this.play()
      }
    },
    play () {
      this.player.play()
    },
    pause () {
      console.log('pause pressed')
      this.player.pause()
    },
    updatePlaybackSpeed (event) {
      this.$store.commit('app/playbackSpeed', event.target.value)
      this.player.playbackRate = event.target.value.toFixed(2)
    },
    increasePlaybackSpeed () {
      const newspeed = parseFloat(this.playbackSpeed) + parseFloat('0.05')
      this.$store.commit('app/playbackSpeed', newspeed.toFixed(2))
      this.player.playbackRate = newspeed.toFixed(2)
    },
    decreasePlaybackSpeed () {
      const newspeed = parseFloat(this.playbackSpeed) - parseFloat('0.05')
      this.$store.commit('app/playbackSpeed', newspeed.toFixed(2))
      this.player.playbackRate = newspeed.toFixed(2)
    },
    async seekForwards () {
      this.player.pause()
      let forwardTo = this.player.currentTime + parseInt(this.groupDetails.seekForwards)
      const duration = this.currentFile.duration

      if (forwardTo >= duration) {
        if (this.currentFile.index < this.details.files.length) {
          forwardTo = forwardTo - this.currentFile.duration
          this.$store.commit('player/currentFile', this.nextFile())
          await this.$store.dispatch('player/load', {
            file: this.currentFile.path,
            seek: 0
          })
        } else {
          // do something here to finish the file
        }
      }
      console.log('> skipping to ' + forwardTo + ' from ' + this.player.currentTime)
      this.player.currentTime = forwardTo
      this.player.play()
    },
    async seekBackwards () {
      this.player.pause()
      const currentSeek = this.player.currentTime
      let backwardTo = currentSeek - parseInt(this.groupDetails.seekBackwards)
      if (backwardTo <= 0) {
        if (this.currentFile.index > 0) {
          this.$store.commit('player/currentFile', this.prevFile())
          backwardTo = this.currentFile.duration + backwardTo
          await this.$store.dispatch('player/load', {
            file: this.currentFile.path,
            seek: this.currentFile.duration
          })
        } else {
          backwardTo = 0
        }
      }
      console.log('< skipping to ' + backwardTo + ' from ' + currentSeek)
      this.player.currentTime = backwardTo
      this.player.play()
    }
  }
}
</script>
<style lang="scss">
.playback-slider {
  @apply bg-transparent h-3 z-10;
  -webkit-appearance: none;
  width: 100%;
  outline: none;
  -webkit-transition: .2s;
  transition: opacity .2s;

  &::-webkit-slider-thumb {
    @apply bg-pink-600 h-3 w-3;
    -webkit-appearance: none;
    appearance: none;
    border-radius: 50%;
    cursor: pointer;
  }

  &::-moz-range-thumb {
    @apply bg-pink-600 h-3 w-3;
    width: 10px;
    height: 10px;
    border-radius: 50%;
    cursor: pointer;
  }

}
</style>
