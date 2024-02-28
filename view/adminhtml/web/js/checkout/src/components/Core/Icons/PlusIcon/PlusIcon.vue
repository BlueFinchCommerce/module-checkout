<template>
  <svg
    :style="style"
    :role="role"
    :aria-label="ariaLabel"
    width="20"
    height="20"
    viewBox="0 0 15 15"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path d="M1.5 7.3125H13.125" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
    <path d="M7.3125 13.125L7.3125 1.5" stroke-width="2" stroke-linecap="round"
          stroke-linejoin="round"/>
  </svg>
</template>

<script>
import { computed, reactive } from 'vue';

export default {
  name: 'PlusIcon',
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
