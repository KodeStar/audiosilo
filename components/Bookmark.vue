<template>
  <div
    class="p-4 bg-gray-200 dark:bg-gray-840 m-1 rounded flex items-center relative cursor-pointer"
    @click="setTime(bookmark.seek)"
  >
    <div class="mr-4">
      <i class="fa-light fa-fw fa-bookmark fa-xl" />
    </div>
    <div class="flex-1">
      <div class="text-sm">{{ bookmark.name }}</div>
      <div class="text-xs text-gray-500 flex items-center justify-between">
        <div class="flex flex-col">
          <span class="text-pink-600"><i class="fa-solid fa-fw fa-circle-play mr-1" />{{ $formatToTime(bookmark.seek, 3, false) }}</span>
          <span>Added: {{ $formatDate(bookmark.added) }} - {{ $formatTime(bookmark.added) }}</span>
        </div>
      </div>
    </div>
    <div @click.stop="showdelete = true" class=""><i class="fa-light fa-fw fa-trash-can" /></div>
    <div v-if="showdelete" class="absolute inset-0 bg-gray-200 dark:bg-gray-840 p-2 flex items-center">
      <div class="flex w-full">
        <button
          @click.stop="deleteItem"
          class="flex-1 bg-pink-600 hover:bg-opacity-90 p-4 py-2 text-gray-50 flex flex-col text-xs mx-1 items-center justify-content text-center rounded"
        >
          <span class="text-gray-50 text-opacity-80">Delete bookmark?</span>
          <span class="text-sm uppercase">Yes</span>
        </button>
        <button
          @click.stop="showdelete = false"
          class="flex-1 bg-gray-700 hover:bg-opacity-90 p-4 py-2 text-gray-50 flex flex-col text-xs mx-1 items-center justify-content text-center rounded"
        >
          <span class="text-gray-50 text-opacity-70">Delete bookmark?</span>
          <span class="text-sm uppercase">No</span>
        </button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Bookmark',
  props: ['bookmark', 'index'],
  data () {
    return {
      showdelete: false
    }
  },

  computed: {
  },
  methods: {
    setTime (time) {
      this.showdelete = false
      this.$emit('setTime', time)
    },
    deleteItem () {
      this.showdelete = false
      this.$store.dispatch('app/deleteBookmark', this.index)
    }
  }
}
</script>
