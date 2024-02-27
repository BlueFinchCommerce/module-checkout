<template>
  <svg :style="style"
       :role="role"
       :aria-label="ariaLabel"
       width="18"
       height="14"
       viewBox="0 0 18 14"
       fill="none"
       xmlns="http://www.w3.org/2000/svg">
    <path d="M17.5 1.41L5.5 13.41L0 7.91L1.41 6.5L5.5 10.58L16.09 0L17.5 1.41Z" fill="#135D1D"/>
  </svg>
</template>

<script>
import { computed, reactive } from 'vue';

export default {
  name: 'ValidIcon',
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
