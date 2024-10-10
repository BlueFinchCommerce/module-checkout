<template>
  <svg
      :style="style"
      :role="role"
      :aria-label="ariaLabel"
      :data-cy="dataCy ? `${dataCy}-search-icon` : 'search-icon'"
      width="23"
      height="23"
      viewBox="0 0 23 23"
      fill="none"
      class="search-icon"
      xmlns="http://www.w3.org/2000/svg">
    <circle cx="9" cy="9" r="8" stroke-width="2"/>
    <path d="M15 15L21.5 21.5" stroke-width="2" stroke-linecap="round"/>
  </svg>
</template>

<script>
import { computed, reactive } from 'vue';

export default {
  name: 'Remove',
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
    dataCy: {
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
