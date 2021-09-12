<template>
  <div class="flex flex-col justify-between relative h-screen overflow-auto">
    <div @click="closePlayer" class="absolute top-0 right-0 w-8 h-8 rounded-bl flex cursor-pointer justify-center items-center"><i class="fa-thin fa-chevron-down"></i></div>
    <div>
      <div class="text p-8 pb-5 flex justify-center flex-shrink">
        <img class="block shadow rounded-md" :src="image" />
      </div>
      <div class="w-full px-8 flex flex-col text-center items-center">
        <div class="text-xl font-semibold flex mb-2">Chapter 1</div>
        <!--<div class="text-sm text-gray-400 mb-2">{{ details.files[0].name }} - Artist name</div>-->
        <div class="flex py-1 items-center w-full relative mb-1">
          <div class="relative flex-grow mr-2">
            <div class="overflow-hidden h-1 text-xs flex rounded bg-purple-200">
              <div :style="{ width: localpercent + '%'}" class="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-purple-400"></div>
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
          <div class="text-xs">{{ secondsToPlayback(current) }}</div>
          <div class="px-8 text-xs">{{ remaining }}</div>
          <div class="text-xs">-{{ secondsToPlayback(localremaining) }}</div>
        </div>
      </div>
    </div>

    <div class="flex items-center w-full justify-evenly my-2">
      <div class="">
        <span  @click="seekBackwards" class="fa-layers fa-fw fa-3x relative">
          <i class="fa-thin fa-circle-notch fa-rotate-by" style="--fa-rotate-angle: -23deg;"></i>
          <i class="fa-solid fa-chevron-left" data-fa-transform="up-30" style="font-size: 12px;"></i>
          <span class="text-sm absolute inset-0 flex justify-center items-center" style="">30</span>
        </span>
      </div>
      <div class="cursor-pointer relative">
        <span v-show="!playing" @click="togglePlay" class="fa-layers fa-fw fa-6x">
          <i class="fa-solid fa-circle text-gray-600"></i>
          <i class="fa-inverse fa-solid fa-play" data-fa-transform="shrink-10"></i>
        </span>
        <span v-show="playing" @click="togglePlay" class="fa-layers fa-fw fa-6x">
          <i class="fa-solid fa-circle text-gray-600"></i>
          <i class="fa-inverse fa-solid fa-pause" data-fa-transform="shrink-10"></i>
        </span>
        <span v-show="loading" @click="togglePlay" class="fa-layers fa-fw fa-6x absolute inset-0 opacity-70">
          <i class="fa-solid fa-circle text-gray-600"></i>
          <i class="fa-inverse fa-light fa-spinner-third fa-spin" data-fa-transform="shrink-2"></i>
        </span>
      </div>
      <div class="">
        <span @click="seekForwards" class="fa-layers fa-fw fa-3x relative">
          <i class="fa-thin fa-circle-notch fa-rotate-by" style="--fa-rotate-angle: 23deg;"></i>
          <i class="fa-solid fa-chevron-right" data-fa-transform="up-30" style="font-size: 12px;"></i>
          <span class="text-sm absolute inset-0 flex justify-center items-center" style="">45</span>
        </span>
      </div>
    </div>
    <div class="p-2 w-full">
      <div class="bg-gray-100 rounded p-3 px-6 w-full relative flex justify-between">
        <button @click="editPlaybackSpeed = true" class="cursor-pointer">{{ playbackSpeed }}x</button>
        <button class="cursor-pointer"><i class="fa-thin fa-alarm-snooze"></i></button>
        <button class="cursor-pointer"><i class="fa-thin fa-airplay"></i></button>
        <button class="cursor-pointer"><i class="fa-thin fa-sliders-up"></i></button>
        <div v-if="editPlaybackSpeed" class="absolute inset-0 flex bg-gray-200 rounded justify-between p-3 px-6">
          <span>{{ playbackSpeed }}x</span>
          <div class="flex items-center">
          <div @click="decreasePlaybackSpeed" class="mx-3 cursor-pointer"><i class="fa-solid fa-circle-minus text-gray-600 fa-lg"></i></div>
          <div><input :value="playbackSpeed" @input="updatePlaybackSpeed" class="w-12 p-2 text-center" /></div>
          <div @click="increasePlaybackSpeed" class="mx-3 cursor-pointer"><i class="fa-solid fa-circle-plus text-gray-600 fa-lg"></i></div>
          </div>
          <div @click="editPlaybackSpeed = false" class="cursor-pointer">Close</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { sha256 } from 'js-sha256'
// import { Howl, Howler } from 'howler'
import { Howl } from 'howler'

export default {
  name: 'Player',
  props: ['details', 'server'],
  data () {
    return {
      editPlaybackSpeed: false,
      player: null,
      playing: false,
      loading: false,
      localremaining: 0,
      current: 0,
      currentFile: {
        index: 0,
        start: 0,
        duration: 0,
        path: ''
      }
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
      return sha256(this.$route.fullPath)
    },
    totalTime () {
      let total = 0
      this.details.files.forEach((file) => {
        total += file.meta.duration
      })
      return total
    },
    remaining () {
      const remaining = this.totalTime - this.seek
      return this.secondsToTime(remaining) + ' remaining'
    },
    percent () {
      const remaining = this.totalTime - this.seek
      const percent = (remaining / this.totalTime) * 100
      return 100 - percent.toFixed(0)
    },
    localpercent () {
      if (this.player) {
        const remaining = this.currentFile.duration - this.current
        const percent = (remaining / this.currentFile.duration) * 100
        return 100 - percent.toFixed(0)
      }
      return 0
    },
    localseek () {
      const value = this.seek - this.currentFile.start
      return value.toFixed(0)
    }
  },

  async mounted () {
    this.currentFile = this.getCurrentFile()
    this.player = await this.loadFile(this.server + 'download/' + this.currentFile.path)

    this.updatePlayerDetails()

    // this.localremaining = this.getLocalRemaining()
    this.current = this.localseek
  },

  beforeDestroy () {
    if (this.player) {
      this.player.unload()
    }
    clearInterval(this.timer)
  },
  methods: {
    updateSeek (event) {
      console.log(event.target.value)
      if (this.player.playing()) {
        this.player.pause()
        this.player.seek(event.target.value)
        this.player.play()
      } else {
        this.player.seek(event.target.value)
        this.current = event.target.value
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

    prevFile () {
      return {
        index: this.currentFile.index - 1,
        start: this.currentFile.start - this.currentFile.duration,
        duration: this.details.files[this.currentFile.index - 1].meta.duration,
        path: this.details.files[this.currentFile.index - 1].path
      }
    },

    async loadFile (file) {
      console.log('Loading file')
      console.log(this.currentFile)

      let format = null
      let src = null

      const filedetails = {
        hash: this.hash,
        // file: this.server + 'download/' + this.details.files[this.currentFile.index].path
        file
      }
      const isCached = await this.$store.dispatch('app/fileIsCached', filedetails)
      if (isCached) {
        const cachedFile = await this.$store.dispatch('app/getCachedFile', filedetails)
        src = cachedFile.src
        format = cachedFile.format
      } else {
        const tempCache = await this.$store.dispatch('app/tempCache', {
          hash: 'temp-' + this.hash,
          file
        })
        src = tempCache.src
        format = tempCache.format
      }
      const that = this
      return new Howl({
        src,
        format,
        html5: true,
        onplay: () => {
          that.loading = false
          that.updatePlayerDetails()
        },
        onpause: () => {
          console.log('pause file')
        },
        onloaderror: (id, err) => {
          console.log('load error')
          console.log(id)
          console.log(err)
        },
        onend: async () => {
          console.log('track ended')
          that.player.unload()
          that.player = null
          await that.nextTrack()
        }
      })
    },
    async nextTrack () {
      const nextFile = this.nextFile()
      this.currentFile = nextFile

      this.player = await this.loadFile(this.server + 'download/' + this.currentFile.path)
      this.player.play()
    },
    async playTrack (index) {

    },
    getCurrentFile () {
      let start = 0
      for (let i = 0, length = this.details.files.length; i < length; i++) {
        console.log(start + this.details.files[i].meta.duration)
        console.log('seek: ' + this.seek)
        if (start + this.details.files[i].meta.duration > this.seek) {
          return {
            index: i,
            start,
            duration: this.details.files[i].meta.duration,
            path: this.details.files[i].path
          }
        }
        start += this.details.files[i].meta.duration
      }
      return {
        index: 0,
        start: 0,
        duration: 0,
        path: ''
      }
    },
    updatePlayerDetails () {
      this.localremaining = this.getLocalRemaining()
      this.current = this.getLocalSeek()
      if (this.playing === true) {
        const that = this
        setTimeout(function () {
          that.updatePlayerDetails()
        }, 1000)
      }
    },
    getLocalRemaining () {
      if (!this.playing) {
        return this.currentFile.duration - this.localseek
      }
      const output = this.currentFile.duration - this.player.seek()
      return output
    },
    getLocalSeek () {
      if (!this.playing) {
        return this.localseek
      }
      return this.player.seek()
    },
    fullseek (seek) {
      return this.currentFile.start + seek
    },
    extension (name) {
      const re = /(?:\.([^.]+))?$/
      return re.exec(name)[1]
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
    secondsToTime (secs) {
      const hours = Math.floor(secs / (60 * 60))

      const divisorForMinutes = secs % (60 * 60)
      const minutes = Math.floor(divisorForMinutes / 60)

      return hours + 'h' + minutes + 'm'
    },
    secondsToPlayback (secs) {
      const hours = Math.floor(secs / (60 * 60))

      const divisorForMinutes = secs % (60 * 60)
      const minutes = Math.floor(divisorForMinutes / 60)

      const divisorForSeconds = divisorForMinutes % 60
      const seconds = Math.ceil(divisorForSeconds)

      let output = ''

      if (hours > 0) {
        output += hours + ':'
      }

      return output + String(minutes).padStart(2, '0') + ':' + String(seconds).padStart(2, '0')
    },
    play () {
      this.loading = true
      if (this.current) {
        this.player.seek(this.current)
        this.player.play()
      }
      this.playing = true
    },
    pause () {
      this.player.pause(this.soundid)
      this.$store.dispatch('app/updateBookDetails', {
        hash: this.hash,
        book: {
          seek: this.fullseek(this.player.seek())
        }
      })
      this.playing = false
    },
    updatePlaybackSpeed (event) {
      this.$store.commit('app/playbackSpeed', event.target.value)
    },
    increasePlaybackSpeed () {
      const newspeed = parseFloat(this.playbackSpeed) + parseFloat('0.05')
      this.$store.commit('app/playbackSpeed', newspeed.toFixed(2))
      this.player.rate(newspeed.toFixed(2))
    },
    decreasePlaybackSpeed () {
      const newspeed = parseFloat(this.playbackSpeed) - parseFloat('0.05')
      this.$store.commit('app/playbackSpeed', newspeed.toFixed(2))
      this.player.rate(newspeed.toFixed(2))
    },
    async seekForwards () {
      this.player.pause()
      let forwardTo = this.player.seek() + parseInt(this.groupDetails.seekForwards)
      const duration = this.player.duration()

      if (forwardTo >= duration) {
        if (this.currentFile.index < this.details.files.length) {
          forwardTo = forwardTo - this.currentFile.duration
          this.currentFile = this.nextFile()
          this.player = await this.loadFile(this.server + 'download/' + this.currentFile.path)
        } else {
          // do something here to finish the file
        }
      }
      console.log('> skipping to ' + forwardTo + ' from ' + this.player.seek())
      this.player.seek(forwardTo)
      this.player.play()
    },
    async seekBackwards () {
      const sound = this.player.pause()._sounds[0]
      const currentSeek = sound._seek
      let backwardTo = currentSeek - parseInt(this.groupDetails.seekBackwards)
      if (backwardTo <= 0) {
        if (this.currentFile.index > 0) {
          this.currentFile = this.prevFile()
          backwardTo = this.currentFile.duration + backwardTo
          this.player = await this.loadFile(this.server + 'download/' + this.currentFile.path)
        } else {
          backwardTo = 0
        }
      }
      console.log('< skipping to ' + backwardTo + ' from ' + currentSeek)
      this.player.seek(backwardTo)
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
    @apply bg-purple-400 h-3 w-3;
    -webkit-appearance: none;
    appearance: none;
    border-radius: 50%;
    cursor: pointer;
  }

  &::-moz-range-thumb {
    @apply bg-purple-400 h-3 w-3;
    width: 10px;
    height: 10px;
    border-radius: 50%;
    cursor: pointer;
  }

}
</style>
