<template>
  <svg :style="style"
       :role="role"
       :aria-label="ariaLabel"
       :data-cy="dataCy ? dataCy : 'success-icon'"
       width="20"
       height="20"
       viewBox="0 0 15 15"
       xmlns="http://www.w3.org/2000/svg">
    <path d="M0 7.5a7.5 7.5 0 1 1 15 0a7.5 7.5 0 0 1-15 0Zm7.072 3.21l4.318-5.398l-.78-.624l-3.682 4.601L4.32 7.116l-.64.768l3.392 2.827Z"></path>
  </svg>
</template>

<script>
import { computed, reactive } from 'vue';

export default {
  name: 'SuccessIcon',
  props: {
    dataCy: {
      type: String,
    },
    width: {
      type: String,
    },
    height: {
      type: String,
    },
    fill: {
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
      })),
    };
  },
};
</script>
