<template>
  <div
    class="text-input"
    :class="{ 'custom-validation-error': validationErrorMessage !== '', ...classes }"
  >
    <label
      :for="identifier"
      :class="{ 'sanitise-error': validationErrorMessage !== '', ...classes }"
    >
      <span
        v-if="label"
        :class="(modelValue.length > 0 || isInputActive) ? 'text-input-has-value'
          : 'text-input-no-value'"
      >
        {{ required ? label + ' *' : label }}
      </span>
      <input
        :id="identifier"
        ref="input"
        :name="name"
        :autocomplete="autocomplete"
        :style="style"
        :type="type"
        :placeholder="required ? placeholder + ' *' : placeholder"
        :disabled="disabled"
        :required="required"
        :aria-label="ariaLabel"
        :data-cy="dataCy ? dataCy : 'input'"
        :value="modelValue"
        :maxlength="maxLength"
        @blur="onBlur"
        @focus="(event) => { moveIntoViewport(event); onFocus() }"
        @input="$emit('update:modelValue', $event.target.value)"
        @keyup="customValidation"
      >
      <slot name="icon" />
    </label>
    <ErrorMessage
      v-if="errorMessage !== ''"
      :message="errorMessage"
      :data-cy="'field-error-message'"
    />
    <ErrorMessage
      v-if="validationErrorMessage !== '' && errorMessage === ''"
      :message="validationErrorMessage"
      :data-cy="'field-error-message'"
    />
  </div>
</template>
<script>
import { computed, reactive } from 'vue';
import { mapWritableState } from 'pinia';
import debounce from 'lodash.debounce';
import useCustomerStore from '@/stores/CustomerStore';
import ErrorMessage from '@/components/Core/ContentComponents/Messages/ErrorMessage/ErrorMessage.vue';
import sanitiseInputValue from '@/helpers/addresses/sanitiseInputValue';
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
    dataCy: {
      type: String,
    },
    name: {
      type: String,
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
    identifier: {
      type: String,
    },
    maxLength: {
      type: Number,
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
      validationErrorMessage: '',
      isInputActive: false,
    };
  },
  computed: {
    ...mapWritableState(useCustomerStore, ['inputsSanitiseError']),
  },
  methods: {
    customValidation(event) {
      const inputValue = this.$refs.input.value;
      const inputType = this.type;
      const isValid = sanitiseInputValue(inputValue, inputType);

      if (this.identifier !== 'password') {
        this.$emit('update:modelValue', inputValue);

        if (isValid) {
          this.validationErrorMessage = '';
        } else {
          const sanitiseErrorMsg = this.$t('errorMessages.sanitiseError');
          this.validationErrorMessage = sanitiseErrorMsg;

          if (inputType === 'tel') {
            if (event.key !== 'Tab') {
              this.$emit('telephone-error');
              this.validationErrorMessage = sanitiseErrorMsg;
            } else {
              this.validationErrorMessage = '';
            }
          }
        }

        // Use $nextTick to check for errors after the DOM is updated
        this.$nextTick(() => {
          this.inputsSanitiseError = document.querySelectorAll('.sanitise-error').length > 0;
        });
      }
    },
    moveIntoViewport(event) {
      this.isInputActive = true;

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
