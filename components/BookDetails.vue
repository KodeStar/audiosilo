<template>
  <div class="flex flex-col overflow-auto pb-8">
    <div class="text p-8 pb-5 flex justify-center">
      <img class="block shadow rounded-md" :src="image" />
    </div>
    <div class="text-xl flex justify-center px-8 font-bold">{{ name }}</div>
    <button class="text-white bg-purple-400 font-normal rounded-lg mx-8 my-4 p-3"><i class="fa-light fa-circle-play"></i> Listen</button>
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
  </div>
</template>

<script>
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
      if (this.details && this.details.cover) {
        const src = (this.fake) ? 'https://m.media-amazon.com/images/I/51y-ivhKErL._SL500_.jpg' : this.server + 'cover/' + this.details.cover.path
        return src
      }
      return null
    },
    description () {
      if (this.fake) {
        return '<p>One of Jane Austen’s most beloved works, Pride and Prejudice, is vividly brought to life by Academy Award nominee Rosamund Pike (Gone Girl). In her bright and energetic performance of this British classic, she expertly captures Austen’s signature wit and tone. Her attention to detail, her literary background, and her performance in the 2005 feature film version of the novel provide the perfect foundation from which to convey the story of Elizabeth Bennett, her four sisters, and the inimitable Mr. Darcy.</p><p>In Pride and Prejudice, the Bennett sisters try to find their way in the repressive strictures of 19th century society. Austen shows the folly of judging by first impressions and the experience of falling in love, and she superbly describes a world which, despite being more than two centuries old, still resonates with modern concerns.</p>'
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
.readmore {
  height: 95px;
  overflow: hidden;
  &.active {
    height: auto;
    overflow: visible;
  }
}
</style>
