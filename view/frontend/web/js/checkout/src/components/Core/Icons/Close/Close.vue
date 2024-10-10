<template>
  <svg
    :style="style"
    :role="role"
    :aria-label="ariaLabel"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg">
    <path d="M19.6142 17.7537L13.8617 12L19.6142 6.24626C20.1286 5.7317 20.1286 4.90048 19.6142 4.38592C19.0997 3.87136 18.2687 3.87136 17.7542 4.38592L12.0018 10.1397L6.24576 4.38592C5.73131 3.87136 4.90028 3.87136 4.38583 4.38592C3.87139 4.90048 3.87139 5.7317 4.38583 6.24626L10.1383 12L4.38583 17.7537C3.87139 18.2683 3.87139 19.0995 4.38583 19.6141C4.90028 20.1286 5.73131 20.1286 6.24576 19.6141L11.9982 13.8603L17.7506 19.6141C18.2651 20.1286 19.0961 20.1286 19.6106 19.6141C20.125 19.0995 20.125 18.2683 19.6106 17.7537H19.6142Z" />
  </svg>
</template>

<script>
import { computed, reactive } from 'vue';

export default {
  name: 'Close',
  props: {
    width: {
      type: String,
    },
    height: {
      type: String,
    },
    fill: {
      type: String,
    },
    stroke: {
      type: String,
    },
    role: {
      type: String,
    },
    ariaLabel: {
      type: String,
    },
  },
  setup(props) {
    const reactiveProps = reactive(props);
    return {
      style: computed(() => ({
        width: reactiveProps.width,
        height: reactiveProps.height,
        fill: reactiveProps.fill,
        stroke: reactiveProps.stroke,
      })),
    };
  },
};
</script>
