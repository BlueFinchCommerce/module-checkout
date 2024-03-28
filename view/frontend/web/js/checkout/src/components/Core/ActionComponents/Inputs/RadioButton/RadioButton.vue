<template>
  <div>
    <label class="radio-button" for="radio-input">
      <input
        id="radio-input"
        type="radio"
        :disabled="disabled"
        :name="name"
        :checked="checked"
        :aria-checked="ariaChecked"
        :role="role"
        :data-cy="dataCy ? dataCy : 'radio-button'"
        @change="changeHandler"
      >
      <slot name="icon" />
      <span :style="style"> {{ text }} </span>
    </label>
    <p v-show="subtextShow">
      {{ subtext }}
    </p>
  </div>
</template>
<script>
import { computed, reactive } from 'vue';

export default {
  name: 'RadioButton',
  props: {
    text: {
      type: String,
    },
    name: {
      type: String,
    },
    dataCy: {
      type: String,
    },
    subtext: {
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
    subtextShow: {
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
