<template>
  <svg :style="style"
       :role="role"
       :aria-label="ariaLabel"
       width="36"
       height="30"
       fill="none"
       xmlns="http://www.w3.org/2000/svg"
       data-v-3203e236="">
    <path d="M0 0h35.455v30H0z"></path>
    <path
        d="M17.5 10.857a3.8 3.8 0 0 0-2.63 1.074 3.625 3.625 0 0 0-1.1 2.569c0 1.994 1.689 3.643 3.73 3.643 2.04 0 3.73-1.65 3.73-3.643 0-1.993-1.69-3.643-3.73-3.643Z"
        fill="#3C3C3C"></path>
    <path
        d="M17.5 6C8.01 6 5.158 14.035 5.132 14.116L5 14.5l.13.384C5.159 14.965 8.01 23 17.5 23c9.49 0 12.342-8.035 12.368-8.116L30 14.5l-.13-.384C29.841 14.035 26.99 6 17.5 6Zm0 14.571c-6.653 0-9.23-4.67-9.854-6.071.626-1.406 3.205-6.071 9.854-6.071 6.653 0 9.23 4.67 9.854 6.071-.626 1.406-3.205 6.071-9.854 6.071Z"
        fill="#3C3C3C"></path>
  </svg>
</template>

<script>
import { computed, reactive } from 'vue';

export default {
  name: 'ShowIcon',
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
