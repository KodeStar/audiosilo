<template>
  <div class="flex flex-col overflow-auto py-16 lg:py-0">
    <div class="text pt-3 lg:pt-8 p-8 pb-5 flex flex-col justify-center">
      <div class="lg:hidden"><BreadCrumbs /></div>
      <div class="w-full relative cover-container bg-gray-300 dark:bg-gray-800 justify-center flex items-center rounded-md shadow-inner">
        <Cover :image="image" :path="$route.query.folder" />
      </div>
    </div>
    <div class="text-xl flex justify-center px-8 font-bold">{{ name }}</div>
    <button @click="listen" class="text-white bg-pink-600 font-normal rounded-lg mx-8 my-4 p-3"><i class="fa-light fa-circle-play"></i> Listen</button>
    <template v-if="description">
      <div :class="{ active: readmore }" class="text px-8 description-text text-sm readmore" v-html="description"></div>
      <div @click="readmore = !readmore" class="px-8 text-pink-600 font-normal text-sm cursor-pointer">{{ moretext }}</div>
    </template>
    <div class="px-8 mt-3 font-normal text-sm">Progress</div>
    <div class="flex px-8 pt-1 items-center">
      <div class="relative flex-grow mr-2">
        <div class="overflow-hidden h-1 text-xs flex rounded bg-gray-300">
          <div :style="{ width: percent + '%'}" class="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-pink-600"></div>
        </div>
      </div>
      <div class="text-sm">{{ percent }}%</div>
    </div>
    <div class="px-8 text-xs">{{ remaining }}</div>

    <div class="px-8 pt-8 flex items-center justify-between">
      <div v-if="cacheavailable" class="cursor-pointer relative">
        <span @click="download" v-show="!cached && !downloading" class="fa-layers fa-fw fa-2x">
          <i class="fa-solid fa-circle"></i>
          <i class="fa-inverse fa-light fa-arrow-down-to-line" data-fa-transform="shrink-8"></i>
        </span>
        <span v-show="downloading" class="fa-layers fa-fw fa-2x">
          <i class="fa-solid fa-circle"></i>
          <i class="fa-inverse fa-thin fa-down-to-line fa-beat" data-fa-transform="shrink-8"></i>
        </span>
        <span v-show="cached" class="fa-layers fa-fw fa-2x">
          <i class="fa-solid fa-circle"></i>
          <i class="fa-inverse fa-thin fa-trash-can" data-fa-transform="shrink-8"></i>
        </span>
        <span v-show="downloading" class="fa-layers fa-fw fa-2x absolute inset-0 opacity-70">
          <i class="fa-solid fa-circle"></i>
          <i class="fa-inverse fa-light fa-spinner-third fa-spin" data-fa-transform="shrink-2"></i>
        </span>
      </div>
      <div @click="loadPlayer" class="cursor-pointer">Show player</div>
    </div>

  </div>
</template>

<script>
import { mapState } from 'vuex'
export default {
  name: 'BookDetails',
  props: ['details', 'name', 'server'],
  data () {
    return {
      readmore: false,
      cached: false,
      downloading: false,
      image: null
    }
  },
  computed: {
    ...mapState('player', ['current', 'currentFile', 'player', 'playing']),
    moretext () {
      return (this.readmore) ? 'Less..' : 'More..'
    },
    description () {
      return this.$store.state.app.book.description
    },
    seek () {
      return this.$store.state.app.book.seek
    },
    hash () {
      return this.$store.getters['app/hash'](this.$route.fullPath)
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
      return this.$formatToTime(remaining, 2, false) + ' remaining'
    },
    percent () {
      const remaining = this.totalTime - this.seek
      const percent = (remaining / this.totalTime) * 100
      return 100 - percent.toFixed(0)
    },
    cacheavailable () {
      return 'caches' in window
    }
  },

  /* async */ mounted () {
    // const keys = await caches.keys()
    this.getImage()
    // const path = (this.details && this.details.description) ? this.details.description.path : null
    // const cover = (this.details && this.details.cover) ? this.server + 'cover/' + this.details.cover.path : null
    /*  */
  },

  methods: {
    async listen () {
      if (this.playing) {
        this.$store.commit('app/player', true)
      } else {
        await this.loadPlayer()
        const autorewind = await this.$store.dispatch('app/autoRewind')
        this.player.currentTime = this.current - autorewind
        this.$store.dispatch('app/savePlayEvent', this.currentFile.start + this.player.currentTime)
        this.player.play()
      }
    },
    async loadPlayer () {
      await this.$store.dispatch('player/load')
      this.$store.commit('app/player', true)
    },
    async getImage () {
      if (this.details && this.details.cover) {
        const src = this.$store.getters['app/getServerUrl'] + 'cover/' + this.details.cover.path
        const options = await this.$store.dispatch('app/fetchOptions')
        const getcover = await fetch(src, options)
        const cover = await getcover.blob()
        const coverUrl = URL.createObjectURL(cover)

        this.image = coverUrl
      }
    },
    async download () {
      this.downloading = true
      const isPersisted = await navigator.storage.persist()
      console.log(`Persisted storage granted: ${isPersisted}`)
      const cacheName = this.$store.state.app.cacheKey + this.hash
      await caches.delete(cacheName)
      const cacheStorage = await caches.open(cacheName)

      await Promise.all(this.details.files.map((file) => {
        const req = new Request(this.$store.getters['app/getFileUrl'](file.path),
          {
            credentials: 'include'
          })
        return cacheStorage.add(req)
      }))
      this.downloading = false
      this.cached = true
    }
  }

}
</script>
<style lang="scss">
.description-text {
  p {
    margin: 15px 0;
  }
}
.readmore {
  height: 95px;
  overflow: hidden;
  &.active {
    height: auto;
    overflow: visible;
  }
}
</style>
