<template>
<div :class="mode">
  <Nuxt />
</div>
</template>

<script>
export default {
  name: 'Default',
  data () {
    return {
    }
  },
  computed: {
    mode () {
      return localStorage.getItem('user-theme') || 'light'
    }
  }

}
</script>
