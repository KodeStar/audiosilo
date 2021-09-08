<template>
  <div class="flex flex-col items-center overflow-auto pb-8">
    <div class="text p-8 pb-5 flex justify-center">
      <img class="block shadow rounded-md" :src="image" />
    </div>
    <div class="text-xl px-8 font-semibold flex mb-2 text-center">Chapter 1</div>
    <div class="text-sm px-8 text-gray-400 mb-2 text-center">{{ details.files[0].name }} - Artist name</div>
    <div class="flex w-full px-8 pt-1 items-center">
      <div class="relative flex-grow mr-2">
        <div class="overflow-hidden h-2 text-xs flex rounded bg-purple-200">
          <div :style="{ width: percent + '%'}" class="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-purple-400"></div>
        </div>
      </div>
      <div class="text-sm">{{ percent }}%</div>
    </div>
    <div class="px-8 text-xs">{{ remaining }}</div>
    <div class="flex items-center w-full justify-evenly my-5">
      <div class="">
        <span class="fa-layers fa-fw fa-3x relative">
          <i class="fa-thin fa-circle-notch fa-rotate-by" style="--fa-rotate-angle: -23deg;"></i>
          <i class="fa-solid fa-chevron-left" data-fa-transform="up-30" style="font-size: 12px;"></i>
          <span class="text-sm absolute inset-0 flex justify-center items-center" style="">30</span>
        </span>
      </div>
      <div class="">
        <span class="fa-layers fa-fw fa-6x">
          <i class="fa-solid fa-circle text-purple-400"></i>
          <i class="fa-inverse fa-solid fa-play" data-fa-transform="shrink-10"></i>
        </span>
      </div>
      <div class="">
        <span class="fa-layers fa-fw fa-3x relative">
          <i class="fa-thin fa-circle-notch fa-rotate-by" style="--fa-rotate-angle: 23deg;"></i>
          <i class="fa-solid fa-chevron-right" data-fa-transform="up-30" style="font-size: 12px;"></i>
          <span class="text-sm absolute inset-0 flex justify-center items-center" style="">45</span>
        </span>
      </div>
    </div>
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
