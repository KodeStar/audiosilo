<template>
  <div class="flex flex-col overflow-auto">
    <div class="text p-8 pb-5 flex justify-center">
      <img class="block shadow rounded-md" :src="image" />
    </div>
    <div class="text-xl flex justify-center px-8 font-bold">{{ name }}</div>
    <div class="text px-8 description-text text-sm prose" v-html="description"></div>
  </div>
</template>

<script>
export default {
  name: 'FolderDetails',
  props: ['details', 'name', 'fake', 'server'],
  data () {
    return {
    }
  },
  computed: {
    image () {
      if (this.details && this.details.cover) {
        const src = (this.fake) ? 'https://cdn.britannica.com/12/172012-050-A9AFF8AF/Jane-Austen-Cassandra-engraving-portrait-1810.jpg' : this.server + 'cover/' + this.details.cover.path
        return src
      }
      return null
    },
    description () {
      return this.$store.state.app.folderDescription
    }
  },
  watch: {
    details (to, from) {
      console.log(to)
      console.log(from)
      if (to !== from && to.description) {
        console.log('update description')
        this.$store.dispatch('app/getFolderDescription', this.details.description.path)
      }
    }
  },

  mounted () {
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
