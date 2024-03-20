<template>
  <iframe
    :id="id"
    :title="title"
    :width="width"
    :height="height"
    :src="src"
  />
</template>
<script>

export default {
  name: 'IframeComponent',
  props: {
    src: {
      type: String,
      default: '',
    },
    id: {
      type: String,
      default: null,
    },
    title: {
      type: String,
      default: null,
    },
    width: {
      type: Number,
      default: null,
    },
    height: {
      type: Number,
      default: null,
    },
  },
};
</script>
