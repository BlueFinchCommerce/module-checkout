<template>
  <svg
    :style="style"
    :role="role"
    :aria-label="ariaLabel"
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 27 14"
    width="27"
    height="14"
  >
    <path
      d="m1.5 13l12-12 12 12"
      stroke=""
      stroke-width="3"
      stroke-linecap="round"
      stroke-linejoin="round"
    />
  </svg>
</template>

<script>
import { computed, reactive } from 'vue';

export default {
  name: 'ArrowUp',
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
