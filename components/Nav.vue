<template>
  <div :class="{ '-translate-x-full': !menu, 'translate-x-0': menu }" class="transition-all z-40 bg-gray-200 flex-shrink-0 flex-grow-0 w-screen transform lg:translate-x-0 lg:w-80 p-8 px-6 h-(screen-80) lg:h-(screen-96) border-r border-gray-300 absolute inset-0 lg:relative">
    <div v-if="collections.length > 1" class="relative border border-gray-100 rounded-2xl appearance-none -mt-8 -mx-6 max-w-xl flex-grow">
      <select :value="currentCollection" @change="changeCollection" class="w-full py-1 px-10 bg-gray-200 text-sm leading-normal max-w-xl">
        <option v-for="(option,index) in collections" :key="index" v-bind:value="index">
          {{ option }}
        </option>
      </select>
    </div>

    <NuxtLink :class="{ active: activepage === 'library' }" class="flex items-center my-2 p-3 px-5 rounded-lg nav" to="/">
      <i class="fa-light fa-rectangle-vertical-history mr-2 fa-lg"></i>
      Library
    </NuxtLink>
    <NuxtLink :class="{ active: activepage === 'settings' }" class="flex items-center my-2 p-3 px-5 rounded-lg nav" to="/settings">
      <i class="fa-light fa-gear mr-2 fa-lg" />
      Settings
    </NuxtLink>
    <NuxtLink :class="{ active: activepage === 'cached' }" class="flex items-center my-2 p-3 px-5 rounded-lg nav" to="/cached">
      <i class="fa-light fa-box-archive mr-2 fa-lg"></i>
      Cached
    </NuxtLink>
    <div class="flex cursor-pointer absolute bottom-0 left-0 border-t border-gray-300 w-full items-center p-5 px-10" @click="logout">
      <i class="fa-light fa-right-from-bracket mr-2 fa-lg"></i>
      Logout
    </div>
  </div>
</template>

<script>
export default {
  name: 'Nav',
  props: [],
  computed: {
    group () {
      return this.$store.state.app.group
    },
    collections () {
      return this.$store.state.app.collections
    },
    menu () {
      return this.$store.state.app.menu
    },
    activepage () {
      return this.$store.state.app.activepage
    }
  },
  methods: {
    logout () {
      this.$store.commit('app/loginStatus', false)
    }
  }
}
</script>
