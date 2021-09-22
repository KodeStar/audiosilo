<template>
  <div
    @click="selecttime = true"
    class="p-4 bg-gray-200 dark:bg-gray-840 m-1 relative rounded flex items-center cursor-pointer"
  >
    <div class="mr-4">
      <i class="fa-light fa-fw fa-clock fa-xl" />
    </div>
    <div class="flex-1">
      <div class="text-sm">{{ $formatDate(item.start) }} - {{ $formatTime(item.start) }}</div>
      <div class="text-xs text-gray-500 flex items-center justify-between">
        <div class="flex flex-col">
          <span class="text-pink-600"><i class="fa-solid fa-fw fa-circle-play mr-1" />{{ $formatToTime(item.startSeek, 3, false) }}</span>
          <span><i class="fa-solid fa-fw fa-circle-pause mr-1" />{{ $formatToTime(item.endSeek, 3, false) }}</span>
        </div>
        <div class="flex flex-col">
          <span>Duration: {{ $formatToTime((item.finish - item.start)/1000, 3, false) }}</span>
          <span>({{ speedUsed((Math.floor(item.endSeek) - Math.floor(item.startSeek)) / Math.floor((item.finish - item.start)/1000)) }}x)</span>
        </div>
        <div></div>
      </div>
    </div>
    <div v-if="selecttime" class="absolute inset-0 bg-gray-200 dark:bg-gray-840 p-2">
      <div class="flex w-full">
        <button
          @click.stop="setTime(item.startSeek)"
          class="flex-1 bg-pink-600 hover:bg-opacity-90 p-4 py-2 text-gray-50 flex flex-col text-xs mx-1 items-center justify-content text-center"
        >
          <span class="text-gray-50 text-opacity-80">Start at</span>
          <span class="text-sm">{{ $formatToTime(item.startSeek, 3, false) }}</span>
          <span class="text-gray-50 text-opacity-80">Position at start</span>
        </button>
        <button
          @click.stop="setTime(item.endSeek)"
          class="flex-1 bg-gray-300 dark:bg-gray-700 hover:bg-opacity-90 p-4 py-2 dark:text-gray-50 flex flex-col text-xs mx-1 items-center justify-content text-center"
        >
          <span class="dark:text-gray-50 text-gray-600 text-opacity-70">Start at</span>
          <span class="text-sm">{{ $formatToTime(item.endSeek, 3, false) }}</span>
          <span class="dark:text-gray-50 text-gray-600 text-opacity-70">Position when paused</span>
        </button>
      </div>
      <div @click.stop="selecttime = false" class="absolute text-xs dark:text-gray-50 underline cursor-pointer -right-1 -top-1 rounded-full p-1 bg-gray-300 dark:bg-gray-700 hover:bg-opacity-90 drop-shadow flex items-center justify-center"><i class="fa-light fa-fw fa-times" /></div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'HistoryItem',
  props: ['item'],
  data () {
    return {
      selecttime: false
    }
  },

  computed: {
  },
  methods: {
    speedUsed (time) {
      return (Math.ceil(time * 20 - 0.5) / 20).toFixed(2)
    },
    setTime (time) {
      this.selecttime = false
      this.$emit('setTime', time)
    }
  }
}
</script>
