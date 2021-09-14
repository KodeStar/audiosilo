<template>
  <div v-if="loginStatus===false" class="fixed inset-0 bg-gray-900 bg-opacity-75 z-50 flex justify-center items-center">
    <div class="rounded-lg flex bg-gray-100 flex-col p-8 w-full max-w-md m-4">
      <div class="flex justify-center mb-5">
        <NuxtLink class="flex items-center" to="/">
          <i class="fa-light text-5xl fa-computer-speaker mr-2 text-gray-600" />
          <div class="flex flex-col">
            <div class="font-semibold uppercase text-pink-600 text-2xl leading-none">
              Audio<span class="font-bold text-gray-600">Serve</span>
            </div>
          </div>
        </NuxtLink>
      </div>
      <floating-label-input class="my-2" v-model="server" title="Server" />
      <floating-label-input class="my-2" v-model="secret" title="Shared Secret" />
      <floating-label-input class="my-2" v-model="group" title="Group" />
      <button class="bg-pink-600 text-white w-full mt-3 p-3 rounded-xl text-lg" @click="login">
        Login
      </button>
    </div>
  </div>
</template>

<script>
import FloatingLabelInput from '~/components/FloatingLabelInput.vue'
export default {
  name: 'Login',
  props: [],
  components: {
    FloatingLabelInput
  },
  data () {
    return {
    }
  },

  computed: {
    loginStatus () {
      return this.$store.state.app.loginStatus
    },
    server: {
      get () {
        return this.$store.state.app.server
      },
      set (value) {
        this.$store.commit('app/server', value)
      }
    },
    group: {
      get () {
        return this.$store.state.app.group
      },
      set (value) {
        this.$store.commit('app/group', value)
      }
    },
    secret: {
      get () {
        return this.$store.state.app.secret
      },
      set (value) {
        this.$store.commit('app/secret', value)
      }
    }
  },
  methods: {
    login () {
      this.$store.dispatch('app/login', {
        server: this.server,
        group: this.group,
        secret: this.secret
      })
    }
  }
}
</script>
