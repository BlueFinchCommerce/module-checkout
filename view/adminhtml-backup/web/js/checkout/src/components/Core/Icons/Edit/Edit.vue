<template>
  <svg
    :style="style"
    :role="role"
    :aria-label="ariaLabel"
    width="15"
    height="15"
    viewBox="0 0 15 15"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M2.73188 12C2.76938 12 2.80688 11.9963 2.84438 11.9906L5.99813 11.4375C6.03563 11.43 6.07125 11.4131 6.0975 11.385L14.0456 3.43687C14.063 3.41953 14.0768 3.39892 14.0862 3.37624C14.0956 3.35356 14.1005 3.32924 14.1005 3.30469C14.1005 3.28013 14.0956 3.25582 14.0862 3.23313C14.0768 3.21045 14.063 3.18985 14.0456 3.1725L10.9294 0.054375C10.8938 0.01875 10.8469 0 10.7963 0C10.7456 0 10.6988 0.01875 10.6631 0.054375L2.715 8.0025C2.68687 8.03063 2.67 8.06437 2.6625 8.10187L2.10938 11.2556C2.09113 11.3561 2.09765 11.4594 2.12836 11.5568C2.15907 11.6542 2.21305 11.7426 2.28562 11.8144C2.40937 11.9344 2.565 12 2.73188 12V12ZM3.99563 8.73L10.7963 1.93125L12.1706 3.30562L5.37 10.1044L3.70313 10.3987L3.99563 8.73V8.73ZM14.4 13.575H0.6C0.268125 13.575 0 13.8431 0 14.175V14.85C0 14.9325 0.0675 15 0.15 15H14.85C14.9325 15 15 14.9325 15 14.85V14.175C15 13.8431 14.7319 13.575 14.4 13.575Z"
      fill="#25303B"
    />
  </svg>
</template>

<script>
import { computed, reactive } from 'vue';

export default {
  name: 'Edit',
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
