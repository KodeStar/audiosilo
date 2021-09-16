<template>
  <div class="flex flex-col overflow-auto pb-8">
    <div class="text p-8 pb-5 px-12 flex flex-col justify-center">
      <img class="block shadow rounded-md" :src="image" />
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

    <div class="px-8 pt-8">
      <div class="cursor-pointer relative">
        <span @click="download" v-show="!cached && !downloading" class="fa-layers fa-fw fa-2x">
          <i class="fa-solid fa-circle text-gray-600"></i>
          <i class="fa-inverse fa-light fa-arrow-down-to-line" data-fa-transform="shrink-8"></i>
        </span>
        <span v-show="downloading" class="fa-layers fa-fw fa-2x">
          <i class="fa-solid fa-circle text-gray-600"></i>
          <i class="fa-inverse fa-thin fa-down-to-line fa-beat" data-fa-transform="shrink-8"></i>
        </span>
        <span v-show="cached" class="fa-layers fa-fw fa-2x">
          <i class="fa-solid fa-circle text-gray-600"></i>
          <i class="fa-inverse fa-thin fa-trash-can" data-fa-transform="shrink-8"></i>
        </span>
        <span v-show="downloading" class="fa-layers fa-fw fa-2x absolute inset-0 opacity-70">
          <i class="fa-solid fa-circle text-gray-600"></i>
          <i class="fa-inverse fa-light fa-spinner-third fa-spin" data-fa-transform="shrink-2"></i>
        </span>
      </div>
    </div>

  </div>
</template>

<script>
import { sha256 } from 'js-sha256'
import VueCookies from 'vue-cookies'
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
    moretext () {
      return (this.readmore) ? 'Less..' : 'More..'
    },
    description () {
      return this.$store.state.app.book.description
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
      return this.$formatToTime(remaining, 2, false) + ' remaining'
    },
    percent () {
      const remaining = this.totalTime - this.seek
      const percent = (remaining / this.totalTime) * 100
      return 100 - percent.toFixed(0)
    }

  },

  async mounted () {
    this.$store.commit('app/rightbar', true)
    const keys = await caches.keys()
    console.log('keys')
    console.log(keys)
    this.getImage()
    // const path = (this.details && this.details.description) ? this.details.description.path : null
    // const cover = (this.details && this.details.cover) ? this.server + 'cover/' + this.details.cover.path : null
    this.$store.dispatch('app/getBookDetails', sha256(this.$route.fullPath))
  },

  methods: {
    listen () {
      this.$store.commit('app/player', true)
    },
    async getImage () {
      if (this.details && this.details.cover) {
        const src = this.$store.getters['app/getServerUrl'] + 'cover/' + this.details.cover.path
        const getcover = await fetch(src, {
          headers: {
            Authorization: 'Bearer ' + VueCookies.get('audioserve_token')
          }
        })
        const cover = await getcover.blob()
        const coverUrl = URL.createObjectURL(cover)

        this.image = coverUrl
      }
    },
    async download () {
      console.log('download')
      this.downloading = true
      const isPersisted = await navigator.storage.persist()
      console.log(`Persisted storage granted: ${isPersisted}`)
      const cacheName = `audioserv-${this.hash}`
      await caches.delete(cacheName)
      const cacheStorage = await caches.open(cacheName)

      await Promise.all(this.details.files.map((file) => {
        return cacheStorage.add(this.$store.getters['app/getServerUrl'] + 'audio/' + file.path + '?trans=0')
      }))
      this.downloading = false
      this.cached = true

      console.log('files cached ' + cacheName)
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
