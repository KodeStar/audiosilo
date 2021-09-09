<template>
  <div class="flex flex-col overflow-auto pb-8">
    <div class="text p-8 pb-5 flex justify-center">
      <img class="block shadow rounded-md" :src="image" />
    </div>
    <div class="text-xl flex justify-center px-8 font-bold">{{ name }}</div>
    <button @click="listen" class="text-white bg-purple-400 font-normal rounded-lg mx-8 my-4 p-3"><i class="fa-light fa-circle-play"></i> Listen</button>
    <template v-if="description">
      <div :class="{ active: readmore }" class="text px-8 description-text text-sm readmore" v-html="description"></div>
      <div @click="readmore = !readmore" class="px-8 text-purple-400 font-normal text-sm cursor-pointer">{{ moretext }}</div>
    </template>
    <div class="px-8 mt-3 font-normal text-sm">Progress</div>
    <div class="flex px-8 pt-1 items-center">
      <div class="relative flex-grow mr-2">
        <div class="overflow-hidden h-2 text-xs flex rounded bg-purple-200">
          <div :style="{ width: percent + '%'}" class="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-purple-400"></div>
        </div>
      </div>
      <div class="text-sm">{{ percent }}%</div>
    </div>
    <div class="px-8 text-xs">{{ remaining }}</div>
    <div @click="download" class="">Download</div>
  </div>
</template>

<script>
import { sha256 } from 'js-sha256'
export default {
  name: 'BookDetails',
  props: ['details', 'name', 'fake', 'server'],
  data () {
    return {
      readmore: false,
      percent: 30,
      remaining: '13h27m remaining'
    }
  },
  computed: {
    moretext () {
      return (this.readmore) ? 'Less..' : 'More..'
    },
    image () {
      return this.$store.state.app.book.cover
    },
    description () {
      return this.$store.state.app.book.description
    },
    transcode () {
      return this.$store.state.app.transcode
    },
    hash () {
      return sha256(this.$route.fullPath)
    }
  },

  async mounted () {
    this.$store.commit('app/rightbar', true)
    const keys = await caches.keys()
    console.log('keys')
    console.log(keys)

    const path = (this.details && this.details.description) ? this.details.description.path : null
    const cover = (this.details && this.details.cover) ? this.server + 'cover/' + this.details.cover.path : null
    this.$store.dispatch('app/getBookDetails', {
      description: path,
      cover
    })
  },

  methods: {
    listen () {
      this.$store.commit('app/player', true)
    },
    async download () {
      console.log('download')
      const isPersisted = await navigator.storage.persist()
      console.log(`Persisted storage granted: ${isPersisted}`)
      const cacheName = `audioserv-${this.hash}`
      await caches.delete(cacheName)
      const cacheStorage = await caches.open(cacheName)

      await this.details.files.forEach(async (file) => {
        await cacheStorage.add(this.server + 'download/' + file.path + '?trans=0')
      })
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
