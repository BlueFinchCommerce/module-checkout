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
    <path d="M5.6425 18C5.6925 18 5.7425 17.995 5.7925 17.9875L9.9975 17.25C10.0475 17.24 10.095 17.2175 10.13 17.18L20.7275 6.5825C20.7507 6.55937 20.7691 6.5319 20.7816 6.50166C20.7942 6.47141 20.8006 6.43899 20.8006 6.40625C20.8006 6.37351 20.7942 6.34109 20.7816 6.31084C20.7691 6.2806 20.7507 6.25313 20.7275 6.23L16.5725 2.0725C16.525 2.025 16.4625 2 16.395 2C16.3275 2 16.265 2.025 16.2175 2.0725L5.62 12.67C5.5825 12.7075 5.56 12.7525 5.55 12.8025L4.8125 17.0075C4.78818 17.1414 4.79687 17.2793 4.83782 17.4091C4.87877 17.5389 4.95074 17.6568 5.0475 17.7525C5.2125 17.9125 5.42 18 5.6425 18ZM7.3275 13.64L16.395 4.575L18.2275 6.4075L9.16 15.4725L6.9375 15.865L7.3275 13.64ZM21.2 20.1H2.8C2.3575 20.1 2 20.4575 2 20.9V21.8C2 21.91 2.09 22 2.2 22H21.8C21.91 22 22 21.91 22 21.8V20.9C22 20.4575 21.6425 20.1 21.2 20.1Z" fill="#3F5D7C"/>
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
