<template>
  <div class="text-input text-area" :class="{ 'custom-validation-error': validationErrorMessage !== '', ...classes }">
    <label :for="identifier" :class="{ 'sanitise-error': validationErrorMessage !== '', ...classes }">
      <span>
        {{ required ? label + ' *' : label }}
      </span>
      <textarea
        :id="identifier"
        ref="textarea"
        :name="name"
        :style="style"
        :placeholder="required ? placeholder + ' *' : placeholder"
        :disabled="disabled"
        :required="required"
        :aria-label="ariaLabel"
        :data-cy="dataCy ? dataCy : 'textarea'"
        :value="modelValue"
        :maxlength="maxLength"
        :rows="rows"
        @blur="onBlur"
        @focus="(event) => { moveIntoViewport(event); onFocus() }"
        @input="$emit('update:modelValue', $event.target.value)"
        @keyup="customValidation"
      >
      </textarea>
    </label>
    <ErrorMessage v-if="errorMessage !== ''"
      :message="errorMessage"
      :data-cy="'field-error-message'"
    />
    <ErrorMessage v-if="validationErrorMessage !== ''"
      :message="validationErrorMessage"
      :data-cy="'field-error-message'"
    />
    <p
      v-show="maxCharacterMessageShow"
      class="max-character-message"
    >
      {{ maxCharacterMessage }}
    </p>
  </div>
</template>
<script>
import { computed, reactive } from 'vue';
import { mapWritableState } from 'pinia';
import useCustomerStore from '@/stores/CustomerStore';
import ErrorMessage from '@/components/Core/ContentComponents/Messages/ErrorMessage/ErrorMessage.vue';
import sanitiseInputValue from '@/helpers/addresses/sanitiseInputValue';
import debounce from 'lodash.debounce';
import breakpoints from './style.module.scss';

export default {
  name: 'TextArea',
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
    rows: {
      type: Number,
    },
    maxCharacterMessageShow: {
      type: Boolean,
      default: false,
    },
    maxCharacterMessage: {
      type: String,
      default: '',
    },
    onBlur: {
      type: Function,
      default: () => {},
    },
    onFocus: {
      type: Function,
      default: () => {},
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
    customValidation() {
      const inputValue = this.$refs.textarea.value;
      const isValid = sanitiseInputValue(inputValue);

      if (isValid) {
        this.$emit('update:modelValue', inputValue);
        this.validationErrorMessage = '';
      } else {
        this.validationErrorMessage = this.$t('errorMessages.sanitiseError');
      }

      // Use $nextTick to check for errors after the DOM is updated
      this.$nextTick(() => {
        this.inputsSanitiseError = document.querySelectorAll('.sanitise-error').length > 0;
      });
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
