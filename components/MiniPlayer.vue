<template>
  <div class="">
  </div>
</template>

<script>
export default {
  name: 'MiniPlayer',
  props: ['details', 'server'],
  data () {
    return {
    }
  },

  computed: {
    image () {
      return this.$store.state.app.book.cover
    }
  },

  mounted () {
  },

  beforeDestroy () {
  },
  methods: {
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
