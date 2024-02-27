<template>
  <div class="text-input">
    <label :for="identifier" :class="classes">
      <span
        v-if="label"
        :class="sanitizedModelValue.length > 0 ? 'text-input-has-value' : 'text-input-no-value'"
      >
        {{ required ? label + ' *' : label }}
      </span>
      <input
        :id="identifier"
        ref="input"
        :autocomplete="autocomplete"
        :style="style"
        :type="type"
        :placeholder="required ? placeholder + ' *' : placeholder"
        :disabled="disabled"
        :required="required"
        :aria-label="ariaLabel"
        :value="modelValue"
        @blur="onBlur"
        @keyup="customValidation"
        @focus="(event) => { moveIntoViewport(event); onFocus() }"
        @input="$emit('update:modelValue', $event.target.value)"
      >
      <slot name="icon" />
    </label>
    <ErrorMessage v-if="errorMessage !== ''" :message="errorMessage"/>
  </div>
</template>
<script>
import { computed, reactive } from 'vue';
import ErrorMessage from '@/components/Core/Messages/ErrorMessage/ErrorMessage.vue';
import sanitiseInputValue from '@/helpers/sanitiseInputValue';
import debounce from 'lodash.debounce';
import breakpoints from './style.module.scss';

export default {
  name: 'TextInput',
  components: {
    ErrorMessage,
  },
  props: {
    modelValue: {
      type: String,
      default: '',
    },
    placeholder: {
      type: String,
    },
    label: {
      type: String,
    },
    ariaLabel: {
      type: String,
    },
    disabled: {
      type: Boolean,
      default: false,
    },
    required: {
      type: Boolean,
      default: false,
    },
    type: {
      type: String,
    },
    borderColor: {
      type: String,
    },
    error: {
      type: Boolean,
    },
    errorMessage: {
      type: String,
      default: '',
    },
    customValidation: {
      type: Function,
    },
    identifier: {
      type: String,
    },
    onBlur: {
      type: Function,
      default: () => {},
    },
    onFocus: {
      type: Function,
      default: () => {},
    },
    autocomplete: {
      type: String,
      default: null,
    },
  },
  setup(props) {
    const reactiveProps = reactive(props);
    return {
      classes: computed(() => ({
        error: reactiveProps.error,
      })),
      style: computed(() => ({
        borderColor: reactiveProps.borderColor,
      })),
    };
  },
  data() {
    return {
      inputVal: '',
    };
  },
  watch: {
    modelValue: {
      handler(newValue) {
        this.$emit('update:modelValue', sanitiseInputValue(newValue));
      },
      immediate: true, // This triggers the handler immediately upon component creation
    },
  },
  computed: {
    sanitizedModelValue() {
      return sanitiseInputValue(this.modelValue);
    },
  },
  methods: {
    moveIntoViewport(event) {
      const breakpoint = parseInt(breakpoints.screenM, 10);

      if (window.innerWidth > breakpoint) {
        return;
      }

      const { target } = event;
      const container = target.closest('.text-input');
      const footer = document.querySelector('.order-summary-container');
      const footerHeight = footer.getBoundingClientRect().height;
      const currScroll = window.scrollY;

      const debouncedResize = debounce(() => {
        const boundingRect = container.getBoundingClientRect();

        const isHidden = (window.innerHeight - footerHeight) < boundingRect.bottom;

        if (isHidden) {
          window.scrollTo({
            top: (boundingRect.bottom + currScroll) - (window.innerHeight - footerHeight),
            behavior: 'smooth',
          });
        }
        window.removeEventListener('resize', debouncedResize);
      }, 20);

      window.addEventListener('resize', debouncedResize);
    },
  },
};
</script>

<style lang="scss" scoped>
@import "@/styles/core/form";
</style>
