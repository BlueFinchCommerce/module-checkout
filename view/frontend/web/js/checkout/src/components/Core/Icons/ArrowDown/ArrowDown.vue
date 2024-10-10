<template>
  <svg
    :style="style"
    :role="role"
    :aria-label="ariaLabel"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path d="M11.9674 13.9948C12.0958 13.876 12.1761 13.8041 12.2531 13.7322C14.4102 11.6344 16.5705 9.53978 18.7243 7.43888C19.1224 7.05435 19.5814 6.89803 20.1207 7.06998C20.9617 7.33572 21.2698 8.32364 20.7338 9.00518C20.6535 9.10522 20.5604 9.19589 20.4673 9.28342C17.9957 11.6844 15.5272 14.0855 13.0556 16.4834C12.3462 17.1743 11.6496 17.1712 10.937 16.4802C8.45256 14.0667 5.96807 11.6501 3.48038 9.23965C3.09197 8.86449 2.9058 8.43931 3.04704 7.91721C3.27815 7.06685 4.32459 6.72295 5.05003 7.2513C5.15275 7.32634 5.24584 7.417 5.33892 7.50766C7.47032 9.5773 9.5985 11.6438 11.7299 13.7134C11.8069 13.7885 11.8711 13.8791 11.9642 13.9917L11.9674 13.9948Z" />
  </svg>
</template>

<script>
import { computed, reactive } from 'vue';

export default {
  name: 'ArrowDown',
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
