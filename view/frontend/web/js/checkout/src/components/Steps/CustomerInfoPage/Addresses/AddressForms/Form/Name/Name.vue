<template>
  <div>
    <!-- First Name Input -->
    <TextInput
      v-model="selectedAddressType.firstname"
      :class="{'field-valid': isFieldValid('firstname', 'First name')}"
      :identifier="`${address_type}-first-name`"
      :label="$t('yourDetailsSection.firstName.label')"
      :placeholder="$t('yourDetailsSection.firstName.placeholder')"
      :error="getAddressFieldHasError(address_type, 'First name')"
      :error-message="getAddressFieldHasError(address_type, 'First name')
        ? $t('errorMessages.firstNameErrorMessage') : ''"
      :data-cy="`${address_type}-first-name-input`"
      type="text"
      :required="isRequired('firstname')"
      autocomplete="given-name"
      @keyup="handleInputChange($event, 'firstname')"
      @focusout="validateField('firstname', 'First name', true)"
    />
    <ValidIcon v-if="isFieldValid('firstname', 'First name')" />
    <ErrorIcon v-if="getAddressFieldHasError(address_type, 'First name')" />
  </div>
  <div>
    <!-- Last Name Input -->
    <TextInput
      v-model="selectedAddressType.lastname"
      :class="{'field-valid': isFieldValid('lastname', 'Last name')}"
      :identifier="`${address_type}-last-name`"
      :label="$t('yourDetailsSection.lastName.label')"
      :placeholder="$t('yourDetailsSection.lastName.placeholder')"
      :error="getAddressFieldHasError(address_type, 'Last name')"
      :error-message="getAddressFieldHasError(address_type, 'Last name')
        ? $t('errorMessages.lastNameErrorMessage') : ''"
      :data-cy="`${address_type}-last-name-input`"
      type="text"
      :required="isRequired('lastname')"
      autocomplete="family-name"
      @keyup="handleInputChange($event, 'lastname')"
      @focusout="validateField('lastname', 'Last name', true)"
    />
    <ValidIcon v-if="isFieldValid('lastname', 'Last name')" />
    <ErrorIcon v-if="getAddressFieldHasError(address_type, 'Last name')" />
  </div>
  <div>
    <!-- Phone Number Input -->
    <div class="phone-field">
      <TextInput
        v-model="selectedAddressType.telephone"
        :class="{'field-valid': isFieldValid('telephone', 'Telephone'),
                 'field-error': getAddressFieldHasError(address_type, 'Telephone')}"
        :error="getAddressFieldHasError(address_type, 'Telephone')"
        :error-message="getAddressFieldHasError(address_type, 'Telephone')
          ? $t('errorMessages.phoneErrorMessage') : ''"
        :identifier="`${address_type}-phone`"
        type="tel"
        :label="$t('yourDetailsSection.phoneField.label')"
        :placeholder="$t('yourDetailsSection.phoneField.placeholder')"
        :data-cy="`${address_type}-phone-number-input`"
        :required="isRequired('telephone')"
        autocomplete="tel"
        @keyup="handleInputChange($event)"
        @focusout="validateField('telephone', 'Telephone', true)"
        @telephone-error="validateField('telephone', 'Telephone', true)"
      />
      <ValidIcon v-if="validateField('telephone', 'Telephone')" />
      <ErrorIcon v-if="getAddressFieldHasError(address_type, 'Telephone')" />
    </div>
  </div>
</template>

<script>
// Stores
import { mapActions, mapWritableState } from 'pinia';
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

  setup() {
    const customerStore = useCustomerStore();

    return {
      getAddressFieldHasError: customerStore.getAddressFieldHasError,
    };
  },
  computed: {
    ...mapWritableState(useCustomerStore, ['selected']),
    selectedAddressType() {
      return this.selected[this.address_type];
    },
  },
  async mounted() {
    await this.getInitialConfig();
    this.validateFields();
  },
  updated() {
    this.validateFields();
  },
  methods: {
    ...mapActions(useConfigStore, ['getInitialConfig']),
    ...mapActions(useCustomerStore, ['validateInputField']),
    ...mapActions(useValidationStore, ['isRequired']),
    validateFields() {
      const first = this.validateField('firstname', 'First name');
      const last = this.validateField('lastname', 'Last name');
      const phone = this.validateField('telephone', 'Telephone');

      const fullDetails = first && last && phone;
      this.$emit('isCustomerInfoFull', fullDetails);
    },
    validateField(field, label, addError) {
      return this.validateInputField(this.address_type, label, this.selectedAddressType[field], field, addError);
    },
    isFieldValid(field, label) {
      return !this.getAddressFieldHasError(this.address_type, label) && this.selectedAddressType[field];
    },
    handleInputChange(event, type) {
      if (event.key === 'Enter') {
        if (type === 'telephone') {
          this.validateField('telephone', 'Telephone');
        } else {
          const fieldName = type === 'firstname' ? 'First name' : 'Last name';
          this.validateField(type, fieldName);
        }
      }
    },
  },
};
</script>

<style lang="scss" scoped>
@import "../styles.scss";
</style>
