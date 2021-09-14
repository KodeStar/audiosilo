<template>
  <div class="flex flex-col items-top h-screen w-full">
    <div class="flex items-center w-full h-20 lg:h-24 border-b border-gray-300 lg:border-b-0 relative">
      <div class="lg:w-80 flex-shrink-0 flex-grow-0 lg:border-r lg:border-b border-gray-300 p-3 px-6 lg:px-10 h-20 lg:h-24 flex items-center">
        <NuxtLink class="flex items-center" to="/">
          <svg
            class="svg-inline--fa fa-computer-speaker text-gray-600 fa-w-20 fa-2xl mr-2"
            aria-hidden="true"
            focusable="false"
            data-prefix="fal"
            data-icon="computer-speaker"
            role="img"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 640 512"
            data-fa-i2svg="">
            <path fill="currentColor" d="M480 192c26.5 0 48-21.5 48-48S506.5 96 480 96s-48 21.5-48 48S453.5 192 480 192zM480 128c8.875 0 16 7.125 16 16S488.9 160 480 160s-16-7.125-16-16S471.1 128 480 128zM480 224c-53 0-96 43-96 96s43 96 96 96s96-43 96-96S533 224 480 224zM480 384c-35.38 0-64-28.62-64-64s28.62-64 64-64s64 28.62 64 64S515.4 384 480 384zM480 296c-13.25 0-24 10.75-24 24s10.75 24 24 24s24-10.75 24-24S493.3 296 480 296zM576 32h-192c-35.35 0-64 28.65-64 64v320c0 35.35 28.65 64 64 64h192c35.35 0 64-28.65 64-64V96C640 60.65 611.3 32 576 32zM608 416c0 17.67-14.33 32-32 32h-192c-17.67 0-32-14.33-32-32V96c0-17.67 14.33-32 32-32h192c17.67 0 32 14.33 32 32V416zM48 64h224C280.8 64 288 56.84 288 48S280.8 32 272 32H47.1c-26.47 0-48 21.53-48 48L0 336C0 362.5 21.53 384 48 384h224C280.8 384 288 376.8 288 368S280.8 352 272 352h-224C39.17 352 32 344.8 32 336v-256C32 71.19 39.17 64 48 64zM272 448h-160C103.2 448 96 455.2 96 464S103.2 480 112 480h160C280.8 480 288 472.8 288 464S280.8 448 272 448z"></path>
          </svg>
          <div class="flex flex-col">
            <div class="font-semibold text-lg uppercase text-pink-600 leading-none">
              Audio<span class="font-bold text-gray-600">Serve</span>
            </div>
            <div class="leading-none text-xs font-normal text-gray-500">
              {{ group }}
            </div>
          </div>
        </NuxtLink>
      </div>
      <div :class="{ mobilesearch: search, flex: search }" class="px-0 lg:px-12 w-full items-center">
        <floating-label-input :class="{ block: search, hidden: !search }" v-model="searchterm" title="Search..." />
        <div class="ml-3">
          <div @click="search = false" :class="{ flex: search, hidden: !search }" class="rounded-full bg-gray-300 w-8 h-8 justify-center items-center"><i class="fa-thin fa-times fa-fw" /></div>
        </div>
        <div :class="{ hidden: search }" class="flex lg:hidden justify-end text-lg mr-1">
          <div @click="search = true" class="bg-gray-200 rounded w-10 h-10 flex justify-center items-center mx-1">
            <i class="fa-light fa-magnifying-glass" />
          </div>
          <div @click="menu = !menu" class="bg-gray-200 rounded w-10 h-10 flex justify-center items-center mx-1">
            <i class="fa-light fa-bars" />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Header',
  props: [],
  components: {
  },
  data () {
    return {
    }
  },

  computed: {
    group () {
      return this.$store.state.app.group
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
    searchterm: {
      get () {
        return this.$store.state.app.searchterm
      },
      set (value) {
        this.$store.commit('app/searchterm', value)
      }
    }
  }
}
</script>
