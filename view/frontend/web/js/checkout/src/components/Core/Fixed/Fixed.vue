<template>
  <div :class="classes">
    <div class="fixed-content">
      <slot />
    </div>
  </div>
</template>

<script>
import { computed, reactive } from 'vue';

export default {
  name: 'FixedArea',
  props: {
    position: {
      type: String,
      default: 'bottom',
      validator(value) {
        return ['top', 'bottom'].indexOf(value) !== -1;
      },
    },
  },
  setup(props) {
    const reactiveProps = reactive(props);
    return {
      classes: computed(() => ({
        fixed: true,
        [`fixed--${reactiveProps.position || 'bottom'}`]: true,
      })),
    };
  },
};
</script>

<style lang="scss" scoped>
@import "./styles.scss";
</style>
