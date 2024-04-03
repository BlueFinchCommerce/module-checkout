<template>
  <button
    :type="type"
    :class="classes"
    :style="style"
    :role="role"
    :aria-label="ariaLabel"
    :disabled="disabled"
    :data-cy="dataCy ? dataCy : type"
  >
    <TextField :text="label" />
  </button>
</template>

<script>
import { reactive, computed } from 'vue';

import TextField from '@/components/Core/ContentComponents/TextField/TextField.vue';

export default {
  name: 'MyButton',
  components: {
    TextField,
  },
  props: {
    type: {
      type: String,
    },
    dataCy: {
      type: String,
    },
    label: {
      type: String,
      required: true,
    },
    primary: {
      type: Boolean,
      default: false,
    },
    secondary: {
      type: Boolean,
      default: false,
    },
    tertiary: {
      type: Boolean,
      default: false,
    },
    backgroundColor: {
      type: String,
    },
    role: {
      type: String,
    },
    ariaLabel: {
      type: String,
    },
    disabled: {
      type: Boolean,
      default: false,
    },
  },
  setup(props) {
    const reactiveProps = reactive(props);
    return {
      classes: computed(() => ({
        button: true,
        'button--primary': reactiveProps.primary,
        'button--secondary': reactiveProps.secondary,
        'button--tertiary': reactiveProps.tertiary,
      })),
      style: computed(() => ({
        backgroundColor: reactiveProps.backgroundColor,
      })),
    };
  },
};
</script>

<style lang="scss">
  @import '@/styles/core/_button.scss';
</style>
