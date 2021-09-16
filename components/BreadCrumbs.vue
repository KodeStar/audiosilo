<template>
  <div v-if="breadcrumbs.length > 1" class="breadcrumbs flex-col lg:flex-row">
    <span
      v-for="(breadcrumb, index) in breadcrumbs"
      :key="index"
      :class="{active: breadcrumb.active }"
      @click="$emit('selectFolder', { path: breadcrumb.link })"
    >
      {{ breadcrumb.name }}
    </span>
  </div>
</template>

<script>
export default {
  name: 'BreadCrumbs',
  computed: {
    breadcrumbs () {
      const breadcrumbs = [{
        name: 'Home',
        link: '/',
        active: false
      }]
      if (this.$route.query.folder) {
        if (this.$route.query.folder !== '/') {
          const segments = this.$route.query.folder.split('/')
          for (let i = 0; i < segments.length; i++) {
            breadcrumbs.push({
              name: segments[i],
              link: segments.slice(0, i + 1).join('/'),
              active: (i === segments.length - 1)
            })
          }
        }
      }
      return breadcrumbs
    }
  }
}
</script>
