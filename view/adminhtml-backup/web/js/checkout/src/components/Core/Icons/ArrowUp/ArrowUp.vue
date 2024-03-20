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
    <path d="M12.0326 10.0052C11.9042 10.124 11.8239 10.1959 11.7469 10.2678C9.58981 12.3656 7.42953 14.4602 5.27567 16.5611C4.87763 16.9457 4.41861 17.102 3.87935 16.93C3.03834 16.6643 2.73019 15.6764 3.26625 14.9948C3.3465 14.8948 3.43959 14.8041 3.53267 14.7166C6.00432 12.3156 8.47276 9.91453 10.9444 7.51663C11.6538 6.82571 12.3504 6.82884 13.063 7.51976C15.5474 9.93329 18.0319 12.3499 20.5196 14.7603C20.908 15.1355 21.0942 15.5607 20.953 16.0828C20.7219 16.9331 19.6754 17.277 18.95 16.7487C18.8473 16.6737 18.7542 16.583 18.6611 16.4923C16.5297 14.4227 14.4015 12.3562 12.2701 10.2866C12.1931 10.2115 12.1289 10.1209 12.0358 10.0083L12.0326 10.0052Z" fill="#3F5D7C"/>
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
