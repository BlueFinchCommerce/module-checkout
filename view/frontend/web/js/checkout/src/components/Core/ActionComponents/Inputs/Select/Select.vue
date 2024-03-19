<template>
  <div class="select-input">
    <label :for="identifier"
           :class="classes">
      <span>
        {{ required ? label + ' *' : label }}
      </span>
      <select ref="selectElement"
              :id="identifier"
              :name="name"
              :data-role="dataRole"
              :disabled="disabled"
              :required="required"
              :value="modelValue"
              :data-cy="dataCy ? dataCy : 'select'"
              @change="onSelectChange">
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
import ArrowDown from '@/components/Core/Icons/ArrowDown/ArrowDown.vue';

export default {
  name: 'SelectInput',
  components: {
    ArrowDown,
  },
  props: {
    error: {
      type: Boolean,
    },
    dataCy: {
      type: String,
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
    required: {
      type: Boolean,
      default: false,
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
  methods: {
    onSelectChange(event) {
      this.$emit('update:modelValue', event.target.value);
      // Toggling the selected class based on whether an option is selected or not
      const selectElement = event.target;
      const selectedOption = selectElement.options[selectElement.selectedIndex];
      if (selectedOption.value !== '') {
        selectElement.classList.add('selected');
      } else {
        selectElement.classList.remove('selected');
      }
    },
    addSelectedClassOnMount() {
      const selectedOption = this.$refs.selectElement.options[this.$refs.selectElement.selectedIndex];

      if (selectedOption.value !== '') {
        this.$refs.selectElement.classList.add('selected');
      }
    },
  },
  mounted() {
    this.addSelectedClassOnMount();
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
