<template>
  <p
    :class="classes"
    :style="style"
    v-html="classes['text-loading'] ? '' : text"
  />
</template>

<script>
import { computed, reactive } from 'vue';

export default {
  name: 'TextField',
  props: {
    text: {
      type: String,
      required: true,
      default: '',
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
    fontStyle: {
      type: String,
    },
  },
  setup(props) {
    const reactiveProps = reactive(props);
    return {
      style: computed(() => ({
        fontSize: reactiveProps.fontSize,
        color: reactiveProps.color,
        fontWeight: reactiveProps.fontWeight,
        fontStyle: reactiveProps.fontStyle,
      })),
      classes: computed(() => ({
        'text-loading': typeof reactiveProps.text === 'string' && reactiveProps.text === ' ',
      })),
    };
  },
};
</script>
<style lang="scss" scoped>
@import "./styles.scss";
</style>
