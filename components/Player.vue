<template>
  <div class="flex flex-col justify-between relative bg-gray-100 dark:bg-gray-840 h-screen overflow-auto pt-safe pb-safe">
    <div class="relative">
      <div @click="closePlayer" class="absolute top-0 right-0 w-8 h-8 rounded-bl flex cursor-pointer justify-center items-center"><i class="fa-thin fa-chevron-down"></i></div>
      <div class="text p-8 pb-5 pt-12 flex justify-center flex-shrink">
        <div class="w-full relative cover-container bg-gray-300 dark:bg-gray-800 justify-center flex items-center rounded-md shadow-inner">
          <Cover :book="book" :path="$route.query.folder" />
          <div v-if="sleep !== null" class="flex absolute bottom-4 left-4 items-center bg-gray-200 dark:bg-gray-860 rounded">
            <div @click="clearSleepTimer" class="p-2 bg-pink-600 flex items-center text-white cursor-pointer text-center rounded"><i class="fa-light fa-fw fa-times" /></div>
            <div v-if="sleep === 'chapter'" class="px-3">End of chapter<i class="ml-3 fa-light fa-alarm-snooze"></i></div>
            <div v-else class="px-3">{{ $formatToPlayback(($store.state.player.sleepend/1000) - (Date.now()/1000)) }}<i class="ml-3 fa-light fa-alarm-snooze"></i></div>
          </div>
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
        <button @click="sleeptimer" class="cursor-pointer"><i class="fa-light fa-alarm-snooze"></i></button>
        <button class="cursor-pointer"><i class="fa-light fa-airplay"></i></button>
        <button @click="playerdetails = true" class="cursor-pointer"><i class="fa-light fa-sliders-up"></i></button>
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
    <div v-if="playerdetails" class="absolute inset-0 bg-gray-100 dark:bg-gray-860 z-40">
      <div class="flex px-4 pt-4 w-full">
        <div @click="swapTab('history')" :class="{ 'dark:text-white text-gray-600 bg-gray-300': historytab }" class="p-4 py-3 mx-1 flex-1 flex items-center bg-gray-200 dark:bg-gray-800 cursor-pointer text-sm text-center rounded">History</div>
        <div @click="swapTab('bookmarks')" :class="{ 'dark:text-white text-gray-600 bg-gray-300': bookmarkstab }" class="p-4 py-3 mx-1 flex-1 flex items-center bg-gray-200 dark:bg-gray-800 cursor-pointer text-sm text-center rounded">Bookmarks</div>
        <div @click="swapTab('chapters')" :class="{ 'dark:text-white text-gray-600 bg-gray-300': chapterstab }" class="p-4 py-3 mx-1 flex-1 flex items-center bg-gray-200 dark:bg-gray-800 cursor-pointer text-sm text-center rounded">Chapters</div>
        <div @click="playerdetails = false" class="p-4 py-3 mx-1 bg-pink-600 flex items-center text-white cursor-pointer text-center rounded"><i class="fa-light fa-fw fa-times" /></div>
      </div>
      <div v-show="bookmarkstab" class="p-4 pt-safe pb-safe">
        <div
          class="p-4 bg-gray-200 dark:bg-gray-800 m-1 rounded flex flex-col items-center cursor-pointer"
        >
          <input type="text" contenteditable="true" placeholder="Bookmark title..." v-model="newbookmark" class="w-full bg-gray-300 dark:bg-gray-860 p-4 py-2 mb-4" />
          <div class="flex text-sm w-full">
            <div class="flex-1 p-4 py-2 flex items-center justify-center bg-gray-300 dark:bg-gray-840">{{ $formatToTime(book.seek, 3, false) }}</div>
            <button class="flex-1 p-4 py-2 bg-pink-600 text-gray-50" @click="addBookmark">Add Bookmark</button>
          </div>
        </div>
        <template v-if="bookmarks">
        <Bookmark
          v-on:setTime="setTime"
          v-for="(bookmark, index) in bookmarks.slice().reverse()"
          :key="index"
          :index="index"
          :bookmark="bookmark"
        />
        </template>
      </div>
      <div v-show="historytab" class="p-4 pt-safe pb-safe">
        <template v-if="history">
        <HistoryItem
          v-on:setTime="setTime"
          v-for="(item, index) in history.slice().reverse()"
          :key="index"
          :item="item"
        />
        </template>
      </div>
    </div>
    <div v-if="setsleeptimer" class="absolute inset-0 bg-gray-100 dark:bg-gray-860 z-40">
      <div class="p-4 pt-safe pb-safe flex flex-col">
        <div class="flex my-1 justify-end"><div @click="setsleeptimer = false" class="p-4 py-3 mx-1 bg-pink-600 flex items-center text-white cursor-pointer text-center rounded"><i class="fa-light fa-fw fa-times" /></div></div>
        <button @click="setSleepTimer(5)" class="bg-gray-300 dark:bg-gray-800 flex p-4 my-1">5 Minutes</button>
        <button @click="setSleepTimer(10)" class="bg-gray-300 dark:bg-gray-800 flex p-4 my-1">10 Minutes</button>
        <button @click="setSleepTimer(15)" class="bg-gray-300 dark:bg-gray-800 flex p-4 my-1">15 Minutes</button>
        <button @click="setSleepTimer(20)" class="bg-gray-300 dark:bg-gray-800 flex p-4 my-1">20 Minutes</button>
        <button @click="setSleepTimer(30)" class="bg-gray-300 dark:bg-gray-800 flex p-4 my-1">30 Minutes</button>
        <button @click="setSleepTimer(40)" class="bg-gray-300 dark:bg-gray-800 flex p-4 my-1">40 Minutes</button>
        <button @click="setSleepTimer(50)" class="bg-gray-300 dark:bg-gray-800 flex p-4 my-1">50 Minutes</button>
        <button @click="setSleepTimer(60)" class="bg-gray-300 dark:bg-gray-800 flex p-4 my-1">60 Minutes</button>
        <button @click="setSleepTimer('chapter')" class="bg-gray-300 dark:bg-gray-800 flex p-4 my-1">End of chapter</button>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex'
export default {
  name: 'Player',
  props: ['details', 'server'],
  data () {
    return {
      editPlaybackSpeed: false,
      playerdetails: false,
      bookmarkstab: false,
      historytab: true,
      chapterstab: false,
      newbookmark: '',
      setsleeptimer: false
    }
  },

  computed: {
    ...mapState('app', ['book', 'groupDetails']),
    ...mapState('player', ['current', 'currentFile', 'loading', 'player', 'playing', 'sleep']),
    history () {
      return this.$store.state.app.book.history
    },
    bookmarks () {
      return this.$store.state.app.book.bookmarks
    },
    image () {
      return this.$store.state.app.book.cover
    },
    playbackSpeed () {
      return Number.parseFloat(this.groupDetails.playback_speed).toFixed(2)
    },
    seek () {
      return this.$store.state.app.book.seek
    },
    book () {
      return this.$store.state.app.book
    },
    hash () {
      return this.$store.getters['app/hash'](this.$route.query.folder)
    },
    remaining () {
      return this.currentFile.duration - this.current
    },
    totalremaining () {
      const remaining = this.$store.getters['player/totalTime'] - this.currentFile.start - this.current
      return this.$formatToTime(remaining, 2, false) + ' remaining'
    },
    localpercent () {
      if (this.player) {
        const percent = (Math.ceil(this.remaining) / this.currentFile.duration) * 100
        return 100 - percent.toFixed(2)
      }
      return 0
    },
    chaptername () {
      if (this.details.files.length > 0 && this.currentFile) {
        return this.details.files[this.currentFile.index].name || ''
      }
      return 'Chapter 1'
    }
  },

  mounted () {
    /* if (this.player.src === '') {
      // this.$store.commit('player/loading', true)
      await this.$store.dispatch('player/load')
    } */
  },

  beforeDestroy () {
    // Delete any temp caches
    caches.delete(this.$store.state.app.cacheKey + 'temp-' + this.hash)
  },
  methods: {
    async setTime (time) {
      await this.$store.dispatch('player/getCurrentFile', {
        files: this.details.files,
        seek: time
      })
      const goToTime = time - this.currentFile.start
      this.player.currentTime = goToTime
      this.$store.commit('player/current', goToTime)
      // this.playerdetails = false
    },
    sleeptimer () {
      this.setsleeptimer = true
      /* const chime = new Audio()
      chime.src = 'chime.wav'
      chime.play() */
    },
    setSleepTimer (mins) {
      if (mins === 'chapter') {
        this.$store.commit('player/sleep', 'chapter')
      } else {
        const seconds = mins * 60 // mins to seconds
        const milliseconds = seconds * 1000 // conds to milliseconds
        this.$store.dispatch('player/sleeptimer', milliseconds)
        this.$store.commit('player/sleepend', Date.now() + milliseconds)
      }
      this.setsleeptimer = false
    },
    clearSleepTimer () {
      if (this.sleep === 'chapter') {
        this.$store.commit('player/sleep', null)
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

    nextFile () {
      return {
        index: this.currentFile.index + 1,
        start: this.currentFile.start + this.currentFile.duration,
        duration: this.details.files[this.currentFile.index + 1].meta.duration,
        path: this.details.files[this.currentFile.index + 1].path
      }
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
    async play () {
      const autorewind = await this.$store.dispatch('app/autoRewind')
      this.player.currentTime = this.current - autorewind
      this.$store.dispatch('app/savePlayEvent', this.currentFile.start + this.player.currentTime)
      this.player.play()
    },
    pause () {
      console.log('pause pressed')
      this.$store.dispatch('app/savePauseEvent', this.currentFile.start + this.current)
      this.player.pause()
    },
    updatePlaybackSpeed (event) {
      const current = this.$store.state.app.groupDetails
      const newdetails = {
        ...current,
        playback_speed: event.target.value
      }
      this.$store.commit('app/groupDetails', newdetails)
      this.$store.dispatch('app/setGroupDetails')

      this.player.playbackRate = event.target.value.toFixed(2)
    },
    increasePlaybackSpeed () {
      const newspeed = parseFloat(this.playbackSpeed) + parseFloat('0.05')
      const current = this.$store.state.app.groupDetails
      const newdetails = {
        ...current,
        playback_speed: newspeed
      }
      this.$store.commit('app/groupDetails', newdetails)
      this.$store.dispatch('app/setGroupDetails')

      this.player.playbackRate = newspeed.toFixed(2)
    },
    decreasePlaybackSpeed () {
      const newspeed = parseFloat(this.playbackSpeed) - parseFloat('0.05')
      const current = this.$store.state.app.groupDetails
      const newdetails = {
        ...current,
        playback_speed: newspeed
      }
      this.$store.commit('app/groupDetails', newdetails)
      this.$store.dispatch('app/setGroupDetails')

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
    },
    swapTab (tab) {
      this.bookmarkstab = (tab === 'bookmarks')
      this.historytab = (tab === 'history')
      this.chapterstab = (tab === 'chapters')
    },
    speedUsed (time) {
      return (Math.ceil(time * 20 - 0.5) / 20).toFixed(2)
    },
    addBookmark () {
      this.$store.dispatch('app/addBookmark', {
        seek: this.book.seek,
        name: this.newbookmark
      })
      this.newbookmark = ''
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
