<template>
  <svg :style="style"
       :role="role"
       :aria-label="ariaLabel"
       width="24"
       height="27"
       fill="none"
       xmlns="http://www.w3.org/2000/svg">
    <path
        d="M1.755 10.346h21.388m-5.37 4.688h.011m-5.334 0h.01m-5.347 0h.01m10.65 4.662h.011m-5.334 0h.01m-5.347 0h.01M17.296 1.46v3.95M7.602 1.46v3.95"
        stroke="#252F3B" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
    <path clip-rule="evenodd"
          d="M17.529 3.355H7.369c-3.525 0-5.726 1.964-5.726 5.572v10.86c0 3.665 2.201 5.673 5.725 5.673h10.15c3.535 0 5.725-1.974 5.725-5.582V8.928c.011-3.61-2.179-5.573-5.714-5.573Z"
          stroke="#252F3B" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
  </svg>
</template>

<script>
import { computed, reactive } from 'vue';

export default {
  name: 'Calendar',
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
