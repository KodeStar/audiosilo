<template>
  <div class="flex flex-col items-center overflow-auto pb-8">
    <div class="text p-8 pb-5 flex justify-center">
      <img class="block shadow rounded-md" :src="image" />
    </div>
    <div class="text-xl font-semibold flex mb-2">Chapter 1</div>
    <div class="text-sm text-gray-400 mb-2">{{ details.files[0].name }} - Artist name</div>
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
  name: 'Player',
  props: ['details', 'server'],
  data () {
    return {
      percent: 30,
      remaining: '13h27m remaining'
    }
  },
  computed: {
    image () {
      if (this.details && this.details.cover) {
        return this.server + 'cover/' + this.details.cover.path
      }
      return null
    }
  }
}
</script>
