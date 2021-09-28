<template>
  <div class="flex flex-col overflow-auto">
    <div class="text p-8 pb-5 flex flex-col justify-center">
      <img class="block shadow rounded-md" :src="image" />
    </div>
    <div class="text-xl flex justify-center px-8 font-bold">{{ name }}</div>
    <div class="text px-8 description-text text-sm prose" v-html="description"></div>
  </div>
</template>

<script>
import VueCookies from 'vue-cookies'
export default {
  name: 'FolderDetails',
  props: ['details', 'name', 'server'],
  data () {
    return {
      image: null
    }
  },
  computed: {
    description () {
      return this.$store.state.app.folderDescription
    }
  },
  watch: {
    details (to, from) {
      // console.log(to)
      // console.log(from)
      if (to !== from && to.description) {
        console.log('update description')
        this.$store.dispatch('app/getFolderDescription', this.details.description.path)
      }
      if (to.image || to.description) {
        this.$store.commit('app/rightbar', true)
      } else {
        this.$store.commit('app/rightbar', false)
      }
      this.image = null
      this.getImage()
    }
  },

  mounted () {
    // check if it should be mounted
    if (this.image || this.description) {
      this.$store.commit('app/rightbar', true)
      this.getImage()
    } else {
      this.$store.commit('app/rightbar', false)
    }
  },

  methods: {
    async getImage () {
      if (this.details && this.details.cover) {
        const src = this.$store.getters['app/getServerUrl'] + 'cover/' + this.details.cover.path
        const getcover = await fetch(src, {
          credentials: 'include',
          headers: {
            Authorization: 'Bearer ' + VueCookies.get('audioserve_token')
          }
        })
        const cover = await getcover.blob()
        const coverUrl = URL.createObjectURL(cover)

        this.image = coverUrl
      }
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
</style>
