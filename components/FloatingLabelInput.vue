<template>
  <div class="relative border border-gray-100 rounded-2xl appearance-none label-floating lg:block max-w-xl flex-grow">
    <input
      v-bind:value="value"
      v-on:input="$emit('input', $event.target.value)"
      class="w-full py-3 px-5 bg-gray-200 shadow-inner leading-normal rounded-2xl max-w-xl"
      type="text"
      :placeholder="title"
    >
    <label
      class="pointer-events-none font-normal select-none absolute block top-0 left-0 w-full px-5 py-3 leading-normal"
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
