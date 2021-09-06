<template>
  <div class="flex flex-col overflow-auto">
    <div class="text p-8 pb-5">
      <img class="block shadow rounded-md" :src="image" />
    </div>
    <div class="text-xl flex justify-center px-8 font-bold">{{ name }}</div>
    <div class="text px-8 description-text text-sm" v-html="description"></div>
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
      if (this.fake) {
        return '<p>Jane Austen (16 December 1775 â€“ 18 July 1817) was an English novelist known primarily for her six major novels, which interpret, critique and comment upon the British landed gentry at the end of the 18th century. Austen\'s plots often explore the dependence of women on marriage in the pursuit of favourable social standing and economic security. Her works critique the novels of sensibility of the second half of the 18th century and are part of the transition to 19th-century literary realism. Her use of biting irony, along with her realism, humour, and social commentary, have long earned her acclaim among critics, scholars, and popular audiences alike.</p><p>With the publication of Sense and Sensibility (1811), Pride and Prejudice (1813), Mansfield Park (1814) and Emma (1816), she achieved success as a published writer. She wrote two other novels, Northanger Abbey and Persuasion, both published posthumously in 1818, and began another, eventually titled Sanditon, but died before its completion. She also left behind three volumes of juvenile writings in manuscript, the short epistolary novel Lady Susan, and another unfinished novel, The Watsons. Her six full-length novels have rarely been out of print, although they were published anonymously and brought her moderate success and little fame during her lifetime.</p>'
      }
      return ''
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
