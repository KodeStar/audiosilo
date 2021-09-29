<template>
  <div
    :class="{ '': !menu, 'block': menu }"
    class="transition-all z-40 bg-gray-200 dark:bg-gray-800 flex-shrink-0 flex-grow-0 w-screen transform lg:block lg:w-80 lg:h-full border-r border-gray-300 dark:border-gray-900 fixed bottom-0 lg:relative leftbar pb-safe">
    <div v-if="collections.length > 1" class="hidden lg:block relative border-t border-gray-100 dark:border-gray-750 appearance-none flex-grow collection-container">
      <select :value="currentCollection" @change="changeCollection" class="w-full py-1 px-6 bg-gray-200 dark:bg-gray-800 text-sm leading-normal w-full">
        <option v-for="(option,index) in collections" :key="index" v-bind:value="index">
          {{ option }}
        </option>
      </select>
    </div>
    <div class="lg:border-t border-gray-100 dark:border-gray-750 lg:p-8 py-1 px-2 lg:px-6 flex lg:flex-col justify-between lg:justify-start">
      <NuxtLink :class="{ active: activepage === 'home' }" class="w-16 lg:w-full flex flex-col lg:flex-row items-center my-1 lg:my-2 p-1 lg:p-3 lg:px-5 rounded-lg nav" to="/">
        <i class="fa-light fa-fw fa-house lg:mr-2 fa-lg"></i>
        <span class="text-xs font-semibold lg:font-normal lg:text-base">Home</span>
      </NuxtLink>
      <NuxtLink :class="{ active: activepage === 'library' }" class="w-16 lg:w-full flex flex-col lg:flex-row items-center my-1 lg:my-2 p-1 lg:p-3 lg:px-5 rounded-lg nav" :to="'/library' + (currentCollection > 0 ? '?collection=' + currentCollection : '')">
        <i class="fa-light fa-fw fa-rectangle-vertical-history lg:mr-2 fa-lg"></i>
        <span class="text-xs font-semibold lg:font-normal lg:text-base">Library</span>
      </NuxtLink>
      <NuxtLink :class="{ active: activepage === 'settings' }" class="w-16 lg:w-full flex flex-col lg:flex-row items-center my-1 lg:my-2 p-1 lg:p-3 lg:px-5 rounded-lg nav" to="/settings">
        <i class="fa-light fa-fw fa-gear lg:mr-2 fa-lg" />
        <span class="text-xs font-semibold lg:font-normal lg:text-base">Settings</span>
      </NuxtLink>
      <!--<NuxtLink :class="{ active: activepage === 'cached' }" class="w-16 lg:w-full flex flex-col lg:flex-row items-center my-1 lg:my-2 p-1 lg:p-3 lg:px-5 rounded-lg nav" to="/cached">
        <i class="fa-light fa-fw fa-box-archive lg:mr-2 fa-lg"></i>
        <span class="text-xs font-semibold lg:font-normal lg:text-base">Cached</span>
      </NuxtLink>-->
      <div @click="search = true" class="lg:hidden w-16 lg:w-full flex flex-col lg:flex-row items-center my-1 lg:my-2 p-1 lg:p-3 lg:px-5 rounded-lg nav">
        <i class="fa-light fa-fw fa-magnifying-glass fa-lg"></i>
        <span class="text-xs font-semibold lg:font-normal lg:text-base">Search</span>
      </div>

      <div class="hidden lg:flex cursor-pointer absolute bottom-0 left-0 border-t border-gray-300 dark:border-gray-900 w-full items-center p-5 px-10 logout" @click="logout">
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
    searchterm: {
      get () {
        return this.$store.state.app.searchterm
      },
      set (value) {
        this.$store.commit('app/searchterm', value)
      }
    },
    search: {
      get () {
        return this.$store.state.app.search
      },
      set (value) {
        this.$store.commit('app/search', value)
      }
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
