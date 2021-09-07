<template>
  <div class="relative border border-light-500 rounded-2xl appearance-none label-floating lg:block max-w-xl flex-grow">
    <input
      v-bind:value="value"
      v-on:input="$emit('input', $event.target.value)"
      class="w-full bg-gray-100 py-3 px-5 leading-normal rounded-2xl max-w-xl"
      type="text"
      :placeholder="title"
    >
    <label
      class="pointer-events-none select-none absolute block top-0 left-0 w-full px-5 py-3 leading-normal"
    >
      {{ title }}
    </label>
  </div>
</template>

<script>
export default {
  name: 'FloatingLabelInput',
  props: ['value', 'title'],
  data () {
    return {
    }
  }
}
</script>
