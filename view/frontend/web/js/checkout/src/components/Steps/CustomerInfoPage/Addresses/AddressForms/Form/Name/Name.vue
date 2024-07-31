<template>
  <div>
    <!-- First Name Input -->
    <TextInput
      v-model="selectedAddressType.firstname"
      :class="{'field-valid': selectedAddressType.firstname && isFieldValid(address_type, 'firstname'),
               'field-error': !isFieldValid(address_type, 'firstname')}"
      :identifier="`${address_type}-first-name`"
      :label="$t('yourDetailsSection.firstName.label')"
      :placeholder="$t('yourDetailsSection.firstName.placeholder')"
      :error="showFieldError(address_type, 'firstname')"
      :error-message="showFieldError(address_type, 'firstname')
        ? $t('errorMessages.firstNameErrorMessage') : ''"
      :data-cy="`${address_type}-first-name-input`"
      type="text"
      :required="isRequired('firstname')"
      autocomplete="given-name"
      @keyup="validateField(address_type, 'firstname', true); handleInputChange($event, 'firstname');"
      @focusout="validateField(address_type, 'firstname', true)"
    />
    <ValidIcon v-if="selectedAddressType.firstname && isFieldValid(address_type, 'firstname')" />
    <div class="error-icon-block">
      <ErrorIcon v-if="!isFieldValid(address_type, 'firstname')" />
    </div>
  </div>
  <div>
    <!-- Last Name Input -->
    <TextInput
      v-model="selectedAddressType.lastname"
      :class="{'field-valid': selectedAddressType.lastname && isFieldValid(address_type, 'lastname'),
               'field-error': !isFieldValid(address_type, 'lastname')}"
      :identifier="`${address_type}-last-name`"
      :label="$t('yourDetailsSection.lastName.label')"
      :placeholder="$t('yourDetailsSection.lastName.placeholder')"
      :error="showFieldError(address_type, 'lastname')"
      :error-message="showFieldError(address_type, 'lastname')
        ? $t('errorMessages.lastNameErrorMessage') : ''"
      :data-cy="`${address_type}-last-name-input`"
      type="text"
      :required="isRequired('lastname')"
      autocomplete="family-name"
      @keyup="validateField(address_type, 'lastname', true); handleInputChange($event, 'lastname')"
      @focusout="validateField(address_type, 'lastname', true)"
    />
    <ValidIcon v-if="selectedAddressType.lastname && isFieldValid(address_type, 'lastname')" />
    <div class="error-icon-block">
      <ErrorIcon v-if="!isFieldValid(address_type, 'lastname')" />
    </div>
  </div>
  <div>
    <!-- Phone Number Input -->
    <div class="phone-field">
      <TextInput
        v-model="selectedAddressType.telephone"
        :class="{'field-valid': selectedAddressType.telephone && isFieldValid(address_type, 'telephone'),
                 'field-error': !isFieldValid(address_type, 'telephone')}"
        :error="showFieldError(address_type, 'telephone')"
        :error-message="showFieldError(address_type, 'telephone')
          ? $t('errorMessages.phoneErrorMessage') : ''"
        :identifier="`${address_type}-phone`"
        type="tel"
        :label="$t('yourDetailsSection.phoneField.label')"
        :placeholder="$t('yourDetailsSection.phoneField.placeholder')"
        :data-cy="`${address_type}-phone-number-input`"
        :required="isRequired('telephone')"
        autocomplete="tel"
        @keyup="handleInputChange($event)"
        @input="validateField(address_type, 'telephone', true)"
        @focusout="validateField(address_type, 'telephone', true)"
        @telephone-error="validateField(address_type, 'telephone', true)"
      />
      <ValidIcon v-if="isFieldValid(address_type, 'telephone')" />
      <div class="error-icon-block">
        <ErrorIcon v-if="!isFieldValid(address_type, 'telephone')" />
      </div>
    </div>
  </div>
</template>

<script>
// Stores
import { mapActions, mapState, mapWritableState } from 'pinia';
import useConfigStore from '@/stores/ConfigStores/ConfigStore';
import useCustomerStore from '@/stores/CustomerStore';
import useValidationStore from '@/stores/ConfigStores/ValidationStore';

// Components
import TextInput from '@/components/Core/ActionComponents/Inputs/TextInput/TextInput.vue';

// Icons
import ErrorIcon from '@/components/Core/Icons/ErrorIcon/ErrorIcon.vue';
import ValidIcon from '@/components/Core/Icons/ValidIcon/ValidIcon.vue';

export default {
  name: 'AddressFormName',
  components: {
    TextInput,
    ValidIcon,
    ErrorIcon,
  },
  props: {
    address_type: {
      type: String,
      default: 'shipping',
    },
  },
  emits: ['isCustomerInfoFull'],

  computed: {
    ...mapWritableState(useCustomerStore, ['selected']),
    ...mapState(useValidationStore, ['isFieldValid']),

    selectedAddressType() {
      return this.selected[this.address_type];
    },
  },
  async mounted() {
    await this.getInitialConfig();
  },
  methods: {
    ...mapActions(useConfigStore, ['getInitialConfig']),
    ...mapActions(useCustomerStore, ['validateInputField']),
    ...mapActions(useValidationStore, ['isRequired', 'validateField', 'showFieldError']),

    handleInputChange(event, type) {
      if (event.key === 'Enter') {
        this.validateField(this.address_type, type, true);
      }
    },
  },
};
</script>

<style lang="scss" scoped>
@import "../styles.scss";
</style>
