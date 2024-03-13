<template>
  <svg  :style="style"
        :role="role"
        :aria-label="ariaLabel"
        xmlns="http://www.w3.org/2000/svg"
        width="91"
        height="8"
        viewBox="0 0 91 8"
        fill="none">
    <path d="M90.8536 4.35355C91.0488 4.15829 91.0488 3.84171 90.8536 3.64645L87.6716 0.464466C87.4763 0.269204 87.1597 0.269204 86.9645 0.464466C86.7692 0.659728 86.7692 0.976311 86.9645 1.17157L89.7929 4L86.9645 6.82843C86.7692 7.02369 86.7692 7.34027 86.9645 7.53553C87.1597 7.7308 87.4763 7.7308 87.6716 7.53553L90.8536 4.35355ZM0 4.5H90.5V3.5H0V4.5Z" fill="#3F5D7C"/>
  </svg>
</template>

<script>
import { computed, reactive } from 'vue';

export default {
  name: 'ProgressBarArrow',
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
