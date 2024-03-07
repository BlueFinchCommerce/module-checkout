<template>
  <TextInput
    v-model="selected[address_type].firstname"
    :identifier="`${address_type}-first-name`"
    :label="$t('yourDetailsSection.firstName.label')"
    :placeholder="$t('yourDetailsSection.firstName.placeholder')"
    :error="getAddressFieldHasError(address_type, 'First name')"
    :error-message="getAddressFieldHasError(address_type, 'First name')
      ? $t('errorMessages.firstNameErrorMessage') : ''"
    type="text"
    required
    autocomplete="given-name"
    @keyup="textChange('First name')"
    @focusout="validateNameField(
      address_type, 'First name', selected[address_type].firstname, true)"
  />
  <TextInput
    v-model="selected[address_type].lastname"
    :identifier="`${address_type}-last-name`"
    :label="$t('yourDetailsSection.lastName.label')"
    :placeholder="$t('yourDetailsSection.lastName.placeholder')"
    :error="getAddressFieldHasError(address_type, 'Last name')"
    :error-message="getAddressFieldHasError(address_type, 'Last name')
      ? $t('errorMessages.lastNameErrorMessage') : ''"
    type="text"
    required
    autocomplete="family-name"
    @keyup="textChange('Last name')"
    @focusout="validateNameField(address_type, 'Last name', selected[address_type].lastname, true)"
  />
  <div class="phone-field">
    <TextInput
      v-model="selected[address_type].telephone"
      :error="getAddressFieldHasError(address_type, 'Telephone')"
      :error-message="getAddressFieldHasError(address_type, 'Telephone')
        ? $t('errorMessages.phoneErrorMessage') : ''"
      :identifier="`${address_type}-phone`"
      type="tel"
      :label="$t('yourDetailsSection.phoneField.label')"
      :placeholder="$t('yourDetailsSection.phoneField.placeholder')"
      required
      autocomplete="tel"
      @keyup="phoneChange"
      @focusout="validatePhone(address_type, selected[address_type].telephone, true)"
    />
    <TextField
      v-if="!phoneErrorClass"
      :text="$t('yourDetailsSection.phoneField.infoMessage')"
      font-weight="300"
    />
  </div>
</template>

<script>
// Stores
import { mapActions, mapWritableState } from 'pinia';
import useCustomerStore from '@/stores/CustomerStore';

// Components
import TextInput from '@/components/Core/Inputs/TextInput/TextInput.vue';
import TextField from '@/components/Core/TextField/TextField.vue';

export default {
  name: 'AddressFormName',
  components: {
    TextInput,
    TextField,
  },
  props: {
    address_type: {
      type: String,
      default: 'shipping',
    },
  },
  emits: [
    'isCustomerInfoFull',
  ],
  setup() {
    const customerStore = useCustomerStore();

    return {
      getAddressFieldHasError: customerStore.getAddressFieldHasError,
    };
  },
  computed: {
    ...mapWritableState(useCustomerStore, ['selected']),
  },
  mounted() {
    this.validateFields();
  },
  updated() {
    this.validateFields();
  },
  methods: {
    ...mapActions(useCustomerStore, [
      'validateNameField',
      'validatePhone',
    ]),

    validateFields() {
      const type = this.address_type;
      const first = this.validateNameField(type, 'First name', this.selected[type].firstname);
      const last = this.validateNameField(type, 'Last name', this.selected[type].lastname);
      const phone = this.validatePhone(type, this.selected[type].telephone);

      const fullDetails = first && last && phone;
      this.$emit('isCustomerInfoFull', fullDetails);
    },

    phoneChange(event) {
      if (event.key === 'Enter') {
        this.validatePhone(this.address_type, this.selected[this.address_type].telephone, true);
      }
    },

    textChange(event, type) {
      if (event.key === 'Enter') {
        this.validateNameField(
          this.address_type,
          type,
          this.selected[this.address_type][type],
        );
      }
    },
  },
};
</script>

<style lang="scss" scoped>
@import "../styles.scss";
</style>
