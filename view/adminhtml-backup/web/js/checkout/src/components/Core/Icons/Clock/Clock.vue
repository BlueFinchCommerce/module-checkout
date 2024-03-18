<template>
  <svg
    :style="style"
    :role="role"
    :aria-label="ariaLabel"
    :width="width"
    :height="height"
    viewBox="0 0 16 20"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M5.29999 1H10.7M7.99999 8.2V11.8M7.99999 19C9.90955 19 11.7409 18.2414 13.0912 16.8912C14.4414 15.5409 15.2 13.7096 15.2 11.8C15.2 9.89044 14.4414 8.05909 13.0912 6.70883C11.7409 5.35857 9.90955 4.6 7.99999 4.6C6.09043 4.6 4.25908 5.35857 2.90882 6.70883C1.55856 8.05909 0.799988 9.89044 0.799988 11.8C0.799988 13.7096 1.55856 15.5409 2.90882 16.8912C4.25908 18.2414 6.09043 19 7.99999 19Z"
      :stroke="stroke"
      stroke-width="1.5"
      stroke-linecap="round"
      stroke-linejoin="round"
    />
  </svg>
</template>
<script>

import { computed, reactive } from 'vue';

export default {
  name: 'Clock',
  props: {
    width: {
      type: String,
      default: '16',
    },
    height: {
      type: String,
      default: '20',
    },
    fill: {
      type: String,
    },
    stroke: {
      type: String,
      default: 'currentColor',
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
