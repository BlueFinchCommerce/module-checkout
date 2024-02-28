<template>
  <div>
    <label :for="'input-checkbox-' + id">
      <input
        :id="'input-checkbox-' + id"
        type="checkbox"
        :disabled="disabled"
        :checked="checked"
        :aria-checked="ariaChecked"
        :role="role"
        :content="content"
        @change="changeHandler"
      >
      <span :style="style">{{ text }}<slot /></span>
    </label>
  </div>
</template>
<script>
import { computed, reactive } from 'vue';

export default {
  name: 'Checkbox',
  props: {
    id: {
      type: String,
      default: '',
    },
    text: {
      type: String,
    },
    content: {
      type: String,
    },
    disabled: {
      type: Boolean,
      default: false,
    },
    checked: {
      type: Boolean,
      default: false,
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
    ariaChecked: {
      type: String,
    },
    role: {
      type: String,
    },
    changeHandler: {
      type: Function,
      default: () => {},
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
    };
  },
};
</script>

<style lang="scss" scoped>
@import "@/styles/core/form";
</style>
