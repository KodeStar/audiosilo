<template>
  <div class="flex flex-col justify-between relative h-screen overflow-auto">
    <div @click="closePlayer" class="absolute top-0 right-0 bg-gray-200 w-8 h-8 rounded-bl flex cursor-pointer justify-center items-center"><i class="fa-thin fa-chevron-down"></i></div>
    <div>
      <div class="text p-8 pb-5 flex justify-center flex-shrink">
        <img class="block shadow rounded-md" :src="image" />
      </div>
      <div class="w-full px-8 flex flex-col text-center items-center">
        <div class="text-xl font-semibold flex mb-2">Chapter 1</div>
        <div class="text-sm text-gray-400 mb-2">{{ details.files[0].name }} - Artist name</div>
        <div class="flex w-full pt-1 items-center">
          <div class="relative flex-grow mr-2">
            <div class="overflow-hidden h-2 text-xs flex rounded bg-purple-200">
              <div :style="{ width: percent + '%'}" class="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-purple-400"></div>
            </div>
          </div>
          <div class="text-sm">{{ percent }}%</div>
        </div>
        <div class="px-8 text-xs">{{ remaining }}</div>
      </div>
    </div>
    <div class="flex items-center w-full justify-evenly my-5">
      <div class="">
        <span class="fa-layers fa-fw fa-3x relative">
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
        <span class="fa-layers fa-fw fa-3x relative">
          <i class="fa-thin fa-circle-notch fa-rotate-by" style="--fa-rotate-angle: 23deg;"></i>
          <i class="fa-solid fa-chevron-right" data-fa-transform="up-30" style="font-size: 12px;"></i>
          <span class="text-sm absolute inset-0 flex justify-center items-center" style="">45</span>
        </span>
      </div>
    </div>
    <div class="p-5 w-full">
      <div class="bg-gray-200 rounded p-3 px-6 w-full relative flex justify-between">
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
import { Howl, Howler } from 'howler'
// import { Howl } from 'howler'

export default {
  name: 'Player',
  props: ['details', 'server'],
  data () {
    return {
      percent: 30,
      remaining: '13h27m remaining',
      editPlaybackSpeed: false,
      player: null,
      soundid: null,
      playing: false,
      seek: 0,
      loading: false
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
    hash () {
      return sha256(this.$route.fullPath)
    }
  },

  async mounted () {
    const cacheName = `audioserv-${this.hash}`
    const cacheStorage = await caches.open(cacheName)
    const cachedResponse = await cacheStorage.match('BillionaireBoy.m4b')
    const src = (cachedResponse !== undefined) ? cachedResponse.url : this.server + 'audio/' + this.details.files[0].path + '?trans=' + this.transcode
    console.log(cachedResponse)
    this.player = new Howl({
      src,
      // src: ['BillionaireBoy.m4b'],
      html5: true
    })
    const that = this
    this.player.on('play', function () {
      console.log('on play')
      that.loading = false
    }).on('load', function () {
      console.log('on load')
    }).on('loaderror', function (id, err) {
      console.log('load error')
      console.log(id)
      console.log(err)
    })
    console.log('m4a' + Howler.codecs('m4a'))
    console.log('m4b' + Howler.codecs('m4b'))
    console.log('aac' + Howler.codecs('aac'))
  },

  methods: {
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
      this.loading = true
      console.log('play file')
      this.player.seek(this.seek, this.soundid)
      if (this.soundid !== null) {
        this.player.play(this.soundid)
      } else {
        this.soundid = this.player.play()
      }
      this.playing = true
    },
    pause () {
      console.log('pause file')
      this.player.pause(this.soundid)
      this.seek = this.player.seek(null, this.soundid)
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
    }
  }
}
</script>
