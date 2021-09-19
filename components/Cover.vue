<template>
  <div class="w-full h-full flex justify-center items-center">
    <img v-if="image" class="block rounded-md h-full" :src="image" />
    <div v-else class="bg-gray-200 w-full h-full p-4 relative rounded flex justify-center items-center text-center">
      <img class="absolute inset-2 transform top-1/2 opacity-60 -translate-y-1/2" src="logo-gray.svg" alt="" />
      <div class="relative z-10" v-html="title">
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Cover',
  props: ['image', 'path'],
  data () {
    return {
    }
  },
  computed: {
    title () {
      let output = ''
      if (this.path) {
        const parts = this.path.split('/')
        parts.forEach((part) => {
          output += '<p class="text-lg my-2 text-gray-600">' + part + '</p>'
        })
      }
      return output
    }
  }
}
</script>
