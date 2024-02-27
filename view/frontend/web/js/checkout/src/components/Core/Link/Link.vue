<template>
  <button
      type="button"
      class="button--link"
      :style="style"
  >
    {{ label }}
  </button>
</template>

<script>
import { reactive, computed } from 'vue';

export default {
  name: 'LinkComponent',

  props: {
    label: {
      type: String,
      required: true,
    },
    color: {
      type: String,
    },
    fontSize: {
      type: String,
    },
    fontWeight: {
      type: String,
    },
  },

  setup(props) {
    const reactiveProps = reactive(props);
    return {
      style: computed(() => ({
        color: reactiveProps.color,
        fontWeight: reactiveProps.fontWeight,
        fontSize: reactiveProps.fontSize,
      })),
    };
  },
};
</script>
<style lang="scss">
@import '../../../styles/core/_button.scss';
</style>
