<template>
  <div>
    <TextInput
      v-model="selected[address_type].firstname"
      :class="{'field-valid': nameValid && !getAddressFieldHasError(address_type, 'First name')}"
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
    <ValidIcon v-if="nameValid && !getAddressFieldHasError(address_type, 'First name')"/>
    <div class="error-icon-block">
      <ErrorIcon/>
    </div>
  </div>
  <div>
    <TextInput
      v-model="selected[address_type].lastname"
      :class="{'field-valid': lastNameValid && !getAddressFieldHasError(address_type, 'Last name')}"
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
    <ValidIcon v-if="lastNameValid && !getAddressFieldHasError(address_type, 'Last name')"/>
    <div class="error-icon-block">
      <ErrorIcon/>
    </div>
  </div>
  <div>
    <div class="phone-field">
      <TextInput
        v-model="selected[address_type].telephone"
        :class="{'field-valid': phoneValid && !getAddressFieldHasError(address_type, 'Telephone')}"
        :error="phoneValidError || getAddressFieldHasError(address_type, 'Telephone')"
        :error-message="phoneValidError || getAddressFieldHasError(address_type, 'Telephone')
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
      <ValidIcon v-if="phoneValid && !getAddressFieldHasError(address_type, 'Telephone')"/>
      <div class="error-icon-block">
        <ErrorIcon/>
      </div>
      <TextField
        v-if="!phoneErrorClass"
        :text="$t('yourDetailsSection.phoneField.infoMessage')"
      />
    </div>
  </div>
</template>

<script>
// Stores
import { mapActions, mapState, mapWritableState } from 'pinia';
import useCustomerStore from '@/stores/CustomerStore';
import useConfigStore from '@/stores/ConfigStores/ConfigStore';

// Components
import TextInput from '@/components/Core/ActionComponents/Inputs/TextInput/TextInput.vue';
import TextField from '@/components/Core/ContentComponents/TextField/TextField.vue';

// Icons
import ErrorIcon from '@/components/Core/Icons/ErrorIcon/ErrorIcon.vue';
import ValidIcon from '@/components/Core/Icons/ValidIcon/ValidIcon.vue';

export default {
  name: 'AddressFormName',
  components: {
    TextInput,
    TextField,
    ValidIcon,
    ErrorIcon,
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
  data() {
    return {
      nameValid: false,
      lastNameValid: false,
      phoneValid: false,
      phoneValidError: false,
    };
  },
  setup() {
    const customerStore = useCustomerStore();

    return {
      getAddressFieldHasError: customerStore.getAddressFieldHasError,
    };
  },
  computed: {
    ...mapWritableState(useCustomerStore, ['selected']),
    ...mapState(useConfigStore, ['storeCode']),
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

      this.nameValid = !!first;
      this.lastNameValid = !!last;

      this.phoneValidError = this.selected[type].telephone.length > 20;
      this.phoneValid = this.selected[type].telephone.length > 1;

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
