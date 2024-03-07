<template>
  <div class="address-form">
    <div class="address-form-fields">
      <form
        autocomplete="on"
        @submit.prevent="validateAndSave()"
      >
        <div>
          <TextInput
            v-model="selected[address_type].street[0]"
            type="text"
            :class="{'field-valid': streetAddress1Valid
            && !getAddressFieldHasError(address_type, 'Address Line 1')}"
            :error="getAddressFieldHasError(address_type, 'Address Line 1')"
            :error-message="getAddressFieldHasError(address_type, 'Address Line 1')
            ? $t('errorMessages.streetErrorMessage') : ''"
            :placeholder="$t('yourDetailsSection.deliverySection.' +
            'addressForm.addressField.placeholder')"
            :label="$t('yourDetailsSection.deliverySection.addressForm.' +
            'addressField.label')"
            required
            @input="validateStreet(selected[address_type].street[0])"
            @focusout="validateStreet(selected[address_type].street[0])"
          />
          <ValidIcon v-if="streetAddress1Valid
          && !getAddressFieldHasError(address_type, 'Address Line 1')"/>
          <div class="error-icon-block">
            <ErrorIcon/>
          </div>
        </div>
        <div>
          <TextInput
            v-model="selected[address_type].street[1]"
            type="text"
            :class="{'field-valid': streetAddress2Valid
            && !getAddressFieldHasError(address_type, 'Address Line 2')}"
            :error="getAddressFieldHasError(address_type, 'Address Line 2')"
            :error-message="getAddressFieldHasError(address_type, 'Address Line 2')
            ? $t('errorMessages.streetErrorMessage') : ''"
            :placeholder="$t('yourDetailsSection.deliverySection.addressForm.' +
            'addressField.unrequired')"
            :label="$t('yourDetailsSection.deliverySection.addressForm.' +
            'addressField.unrequiredLabel')"
            @input="validateStreet2(selected[address_type].street[1])"
            @focusout="validateStreet2(selected[address_type].street[1])"
          />
          <ValidIcon v-if="streetAddress2Valid
          && !getAddressFieldHasError(address_type, 'Address Line 2')"/>
          <div class="error-icon-block">
            <ErrorIcon/>
          </div>
        </div>
        <div>
          <TextInput
            v-model="selected[address_type].city"
            type="text"
            :class="{'field-valid': cityValid
            && !getAddressFieldHasError(address_type, 'City')}"
            :error="getAddressFieldHasError(address_type, 'City')"
            :error-message="getAddressFieldHasError(address_type, 'City')
            ? $t('errorMessages.cityErrorMessage') : ''"
            :placeholder="$t('yourDetailsSection.deliverySection.addressForm.' +
            'cityField.placeholder')"
            :label="$t('yourDetailsSection.deliverySection.addressForm.' +
            'cityField.label')"
            required
            @input="validateCity(selected[address_type].city)"
            @focusout="validateCity(selected[address_type].city)"
          />
          <ValidIcon v-if="cityValid
          && !getAddressFieldHasError(address_type, 'City')"/>
          <div class="error-icon-block">
            <ErrorIcon/>
          </div>
        </div>
        <div>
          <TextInput
            v-if="displayState && !getRegionOptions(address_type).length"
            v-model="selected[address_type].region"
            :class="{'field-valid': regionValid
            && !getAddressFieldHasError(address_type, 'State/Region')}"
            type="text"
            :error="getAddressFieldHasError(address_type, 'State/Region')"
            :error-message="getAddressFieldHasError(address_type, 'State/Region')
            ? $t('errorMessages.regionErrorMessage') : ''"
            :placeholder="$t('yourDetailsSection.deliverySection.addressForm.' +
            'regionField.placeholder')"
            :label="$t('yourDetailsSection.deliverySection.addressForm.' +
            'regionField.label')"
            :required="getRegionRequired(address_type)"
            @input="validateRegion(selected[address_type].region)"
            @focusout="validateRegion(selected[address_type].region)"
          />
          <ValidIcon v-if="regionValid
          && !getAddressFieldHasError(address_type, 'State/Region')"/>
          <div class="error-icon-block">
            <ErrorIcon/>
          </div>
        </div>
        <SelectInput
          v-if="displayState && getRegionOptions(address_type).length"
          v-model="selected[address_type].region_id"
          :options="getRegionOptions(address_type)"
          :error="getAddressFieldHasError(address_type, 'State/Region')"
          :label="$t('yourDetailsSection.deliverySection.addressForm.' +
          'regionField.label')"
          :required="getRegionRequired(address_type)"
          @change="setRegion($event)"
        />
        <div>
          <TextInput
            v-model="selected[address_type].postcode"
            :error="getAddressFieldHasError(address_type, 'Postcode')"
            :class="{'field-valid': postCodeValid
            && selected[address_type].postcode !== ''}"
            type="text"
            autocomplete="postal-code"
            :placeholder="$t('yourDetailsSection.deliverySection.addressForm.' +
            'postCodeField.placeholder')"
            :label="$t('yourDetailsSection.deliverySection.addressForm.' +
            'postCodeField.label')"
            :required="postcodeRequired(selected[address_type].country_id)"
            @input="validatePostcode(address_type, true)"
            @focusout="validatePostcode(address_type, true)"
          />
          <ValidIcon v-if="postCodeValid && selected[address_type].postcode !== ''"/>
          <div class="error-icon-block">
            <ErrorIcon/>
          </div>
          <ErrorMessage
            v-if="getAddressFieldHasError(address_type, 'Postcode')"
            :message="
            `${$t('errorMessages.postCodeErrorMessage')} ${selected[address_type].country_id}`"
          />
        </div>
        <SelectInput
          v-model="selected[address_type].country_id"
          :options="selectOptions"
          :error="getAddressFieldHasError(address_type, 'Country')"
          :label="$t('yourDetailsSection.deliverySection.addressForm.countryField.label')"
          :selected-option="$t('yourDetailsSection.selectPlaceholder')"
          required
          @change="countryUpdated($event)"
        />
        <ErrorMessage
          v-if="getAddressFieldHasError(address_type, 'Country')"
          :message="$t('errorMessages.countryErrorMessage')"
        />
        <ErrorMessage
          v-if="requiredErrorMessage"
          :message="requiredErrorMessage"
        />
        <div
          v-if="isLoggedIn"
          class="save-address-field"
        >
          <label :for="`${address_type}-save-in-address-book`">
            <input
              :id="`${address_type}-save-in-address-book`"
              v-model.number="selected[address_type].save_in_address_book"
              type="checkbox"
              class="field__checkbox"
              value="1"
              :true-value="1"
              :false-value="0"
            >
            <TextField
              :text="$t('saveNewAddress')"
              font-size="15px"
              font-weight="300"
            />
          </label>
        </div>
        <div>
          <MyButton
            v-if="address_type !== 'shipping'"
            class="select-address-btn"
            type="submit"
            primary
            :disabled="!buttonEnabled"
            :label="$t('yourDetailsSection.deliverySection' +
              '.addressForm.saveAddressButton')"
          />
        </div>
      </form>
    </div>
  </div>
</template>
<script>
// components
import TextInput from '@/components/Core/Inputs/TextInput/TextInput.vue';
import SelectInput from '@/components/Core/Inputs/Select/Select.vue';
import MyButton from '@/components/Core/Button/Button.vue';
import ErrorMessage from '@/components/Core/Messages/ErrorMessage/ErrorMessage.vue';
import TextField from '@/components/Core/TextField/TextField.vue';
import ValidIcon from '@/components/Core/Icons/ValidIcon/ValidIcon.vue';
import ErrorIcon from '@/components/Core/Icons/ErrorIcon/ErrorIcon.vue';

// Stores
import { mapActions, mapState, mapWritableState } from 'pinia';
import useCustomerStore from '@/stores/CustomerStore';
import useConfigStore from '@/stores/ConfigStore';

// Helpers
import deepClone from '@/helpers/deepClone';

export default {
  name: 'AddressForm',
  components: {
    TextField,
    TextInput,
    SelectInput,
    MyButton,
    ErrorMessage,
    ValidIcon,
    ErrorIcon,
  },
  props: {
    address_type: {
      type: String,
      default: 'shipping',
    },
  },
  setup() {
    const customerStore = useCustomerStore();

    return {
      getAddressFieldHasError: customerStore.getAddressFieldHasError,
      getRegionOptions: customerStore.getRegionOptions,
      getRegionRequired: customerStore.getRegionRequired,
    };
  },
  data() {
    return {
      buttonEnabled: false,
      requiredErrorMessage: '',
      streetAddress1Valid: false,
      streetAddress2Valid: false,
      cityValid: false,
      regionValid: false,
    };
  },
  computed: {
    ...mapWritableState(useCustomerStore, ['selected', 'isLoggedIn', 'postCodeValid', 'inputsSanitiseError']),
    ...mapState(useConfigStore, ['countries', 'stateRequired', 'displayState',
      'countryCode', 'optionalZipCountries', 'postcodeRequired']),
    selectOptions() {
      return this.countries
        .map((country) => (
          {
            option: {
              name: country.full_name_locale,
              value: country.id,
            },
          }
        ));
    },
  },
  created() {
    this.setupCountry();
    this.updateRegionRequired(this.address_type);

    const customerStore = useCustomerStore();
    customerStore.$subscribe((mutation) => {
      if (mutation.type === 'direct' || (mutation.type === 'patch object'
        && mutation.payload.selected
        && mutation.payload.selected[this.address_type])) {
        this.updateButtonState();
      }
    }, { flush: 'sync' });
    this.updateButtonState();
  },
  methods: {
    ...mapActions(useCustomerStore, [
      'validateAddress',
      'setAddressAsCustom',
      'setAddress',
      'setEditing',
      'addAddressError',
      'removeAddressError',
      'updateRegionRequired',
      'validateNameField',
      'validatePhone',
      'validatePostcode',
    ]),
    validateAndSave() {
      this.requiredErrorMessage = '';
      const isValid = this.validateAddress(this.address_type, true) && this.validatePostcode(this.address_type, true);
      if (isValid) {
        this.setAddressAsCustom(this.address_type);
        this.setEditing(this.address_type, false);

        // If the address type is shipping and the billing is set to use the same then update billing too.
        if (this.address_type === 'shipping' && this.selected.billing.same_as_shipping) {
          const clonedShipping = deepClone(this.selected.shipping);
          this.setAddress(clonedShipping, 'billing');
        }
      } else {
        const fieldErrors = this.selected.formErrors[this.address_type];
        Object.entries(fieldErrors).forEach(([value]) => {
          this.addAddressError(this.address_type, value);
        });
        this.requiredErrorMessage = this.selected.formErrors.message[this.address_type];
      }
    },

    setupCountry() {
      if (!this.selected[this.address_type].country_id) {
        this.selected[this.address_type].country_id = this.countryCode;
      }
    },

    countryUpdated() {
      this.updateRegionRequired(this.address_type);
      this.validatePostcode(this.address_type, true);
    },

    setRegion(event) {
      const availableRegions = this.getRegionOptions(this.address_type);
      if (availableRegions.length) {
        const regionId = parseInt(event.target.value, 10);
        const region = availableRegions.find((rgion) => rgion.option.value === regionId);
        if (region) {
          this.selected[this.address_type].region = region.option.name;
        } else {
          this.selected[this.address_type].region = '';
          this.selected[this.address_type].region_id = 0;
        }
      }
    },

    validateStreet(text) {
      let hasError = !text || (typeof text === 'string' && !text.trim());

      if (!hasError) {
        const streetAddress1 = this.selected[this.address_type].street[0];
        const streetAddress2 = this.selected[this.address_type].street[1];
        hasError = ([streetAddress1, streetAddress2].join(' ').length > 75);

        this.streetAddress1Valid = !hasError;
      }

      hasError
        ? this.addAddressError(this.address_type, 'Address Line 1')
        : this.removeAddressError(this.address_type, 'Address Line 1');
    },

    validateStreet2(text) {
      const streetAddress1 = this.selected[this.address_type].street[0];
      const streetAddress2 = this.selected[this.address_type].street[1];
      const hasError = (text && [streetAddress1, streetAddress2].join(' ').length > 75);

      this.streetAddress2Valid = !hasError;

      hasError
        ? this.addAddressError(this.address_type, 'Address Line 2')
        : this.removeAddressError(this.address_type, 'Address Line 2');
    },

    validateCity(text) {
      const hasError = !text || (typeof text === 'string' && !text.trim());

      this.cityValid = !hasError;

      hasError
        ? this.addAddressError(this.address_type, 'City')
        : this.removeAddressError(this.address_type, 'City');
    },

    validateRegion(text) {
      // First check to see if region is even required.
      if (this.getRegionRequired(this.address_type)) {
        const hasError = !text || (typeof text === 'string' && !text.trim());

        this.regionValid = !hasError;

        hasError
          ? this.addAddressError(this.address_type, 'State/Region')
          : this.removeAddressError(this.address_type, 'State/Region');
      }
    },

    updateButtonState() {
      const addressType = this.address_type;

      // If we're on shipping then names are valid in this scenario.
      // If we're on billing then validate the name fields.
      const areNamesValid = addressType !== 'billing'
        || (
          this.validateNameField(
            addressType,
            'First name',
            this.selected[addressType].firstname,
          ) && this.validateNameField(
            addressType,
            'Last name',
            this.selected[addressType].firstname,
          ) && this.validatePhone(
            addressType,
            this.selected[addressType].telephone,
          )
        );

      const validAddress = this.validateAddress(addressType);
      const validPostcode = this.validatePostcode(this.address_type);

      this.buttonEnabled = !this.inputsSanitiseError && validAddress && validPostcode && areNamesValid;
    },
  },
};
</script>
<style lang="scss" scoped>
@import "./styles.scss";
@import "@/styles/core/form.scss";
</style>
