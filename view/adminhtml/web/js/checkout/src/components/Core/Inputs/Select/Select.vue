<template>
  <div class="select-input">
    <label :for="identifier"
           :class="classes">
      <span>
        {{ label }}
      </span>
      <select :id="identifier"
              :name="name"
              :data-role="dataRole"
              :disabled="disabled"
              :value="modelValue"
              @change="$emit('update:modelValue', $event.target.value)">
        <option value="" disabled selected>{{selectedOption}}</option>
        <option v-for="(option, index) in options"
                :value="option.option.value"
                :key="index">
          {{ option.option.name }}
        </option>
      </select>
      <ArrowDown />
    </label>
  </div>
</template>
<script>
import { computed, reactive } from 'vue';
import ArrowDown from '../../Icons/ArrowDown/ArrowDown.vue';

export default {
  name: 'SelectInput',
  components: {
    ArrowDown,
  },
  props: {
    error: {
      type: Boolean,
    },
    label: {
      type: String,
    },
    modelValue: {
      type: String || Number,
      default: '',
    },
    name: {
      type: String,
    },
    selectedOption: {
      type: String || Number,
    },
    identifier: {
      type: String,
    },
    options: {
      type: Array,
      default() {
        return [
          {
            option: {
              name: 'First',
              value: '1',
            },
          },
          {
            option: {
              name: 'Second',
              value: '2',
            },
          },
        ];
      },
    },
    dataRole: {
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
        error: reactiveProps.error,
      })),
    };
  },
};
</script>
<style lang="scss" scoped>
@import "@/styles/core/form";
</style>
