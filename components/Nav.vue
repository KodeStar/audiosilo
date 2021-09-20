<template>
  <div :class="{ 'hidden': !menu, 'block': menu }" class="transition-all z-40 bg-gray-200 dark:bg-gray-800 flex-shrink-0 flex-grow-0 w-screen transform lg:block lg:w-80 h-(screen-80) lg:h-(screen-96) border-r border-gray-300 dark:border-gray-900 absolute inset-0 lg:relative leftbar">
    <div v-if="collections.length > 1" class="relative border-t border-gray-100 dark:border-gray-750 appearance-none flex-grow collection-container">
      <select :value="currentCollection" @change="changeCollection" class="w-full py-1 px-6 bg-gray-200 dark:bg-gray-800 text-sm leading-normal w-full">
        <option v-for="(option,index) in collections" :key="index" v-bind:value="index">
          {{ option }}
        </option>
      </select>
    </div>
    <div class="lg:border-t border-gray-100 dark:border-gray-750 p-8 px-6">
      <NuxtLink :class="{ active: activepage === 'library' }" class="flex items-center my-2 p-3 px-5 rounded-lg nav" to="/">
        <i class="fa-light fa-fw fa-rectangle-vertical-history mr-2 fa-lg"></i>
        Library
      </NuxtLink>
      <NuxtLink :class="{ active: activepage === 'settings' }" class="flex items-center my-2 p-3 px-5 rounded-lg nav" to="/settings">
        <i class="fa-light fa-fw fa-gear mr-2 fa-lg" />
        Settings
      </NuxtLink>
      <NuxtLink :class="{ active: activepage === 'cached' }" class="flex items-center my-2 p-3 px-5 rounded-lg nav" to="/cached">
        <i class="fa-light fa-fw fa-box-archive mr-2 fa-lg"></i>
        Cached
      </NuxtLink>
      <div class="flex cursor-pointer absolute bottom-0 left-0 border-t border-gray-300 dark:border-gray-900 w-full items-center p-5 px-10 logout" @click="logout">
        <i class="fa-light fa-fw fa-right-from-bracket mr-2 fa-lg"></i>
        Logout
      </div>
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
    menu: {
      get () {
        return this.$store.state.app.menu
      },
      set (value) {
        this.$store.commit('app/menu', value)
      }
    },
    activepage () {
      return this.$store.state.app.activepage
    },
    currentCollection () {
      return this.$store.state.app.currentCollection
    }

  },
  methods: {
    logout () {
      this.$store.commit('app/loginStatus', false)
    },
    changeCollection (event) {
      this.$store.commit('app/currentCollection', event.target.value)
    }
  }
}
</script>
