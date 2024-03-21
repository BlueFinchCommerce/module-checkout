<template>
  <div class="address-form">
    <div class="address-form-fields">
      <form autocomplete="on" @submit.prevent="validateAndSave()">
        <!-- Address Line 1 -->
        <div>
          <TextInput
            v-model="selectedAddressType.street[0]"
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
            autocomplete="address-line1"
            required
            @input="validateStreet(selectedAddressType.street[0])"
            @focusout="validateStreet(selectedAddressType.street[0])"
          />
          <ValidIcon v-if="streetAddress1Valid
          && !getAddressFieldHasError(address_type, 'Address Line 1')"/>
          <div class="error-icon-block">
            <ErrorIcon/>
          </div>
        </div>
        <!-- Address Line 2 -->
        <div>
          <TextInput
            v-model="selectedAddressType.street[1]"
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
            autocomplete="address-line2"
            @input="validateStreet2(selectedAddressType.street[1])"
            @focusout="validateStreet2(selectedAddressType.street[1])"
          />
          <ValidIcon v-if="streetAddress2Valid
          && !getAddressFieldHasError(address_type, 'Address Line 2')"/>
          <div class="error-icon-block">
            <ErrorIcon/>
          </div>
        </div>
        <!-- City -->
        <div>
          <TextInput
            v-model="selectedAddressType.city"
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
            autocomplete="address-level2"
            @input="validateCity(selectedAddressType.city)"
            @focusout="validateCity(selectedAddressType.city)"
          />
          <ValidIcon v-if="cityValid
          && !getAddressFieldHasError(address_type, 'City')"/>
          <div class="error-icon-block">
            <ErrorIcon/>
          </div>
        </div>
        <!-- Region -->
        <div>
          <TextInput
            v-if="displayState && !getRegionOptions(address_type).length"
            v-model="selectedAddressType.region"
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
            autocomplete="address-level1"
            :required="getRegionRequired(address_type)"
            @input="validateRegion(selectedAddressType.region)"
            @focusout="validateRegion(selectedAddressType.region)"
          />
          <ValidIcon v-if="regionValid
          && !getAddressFieldHasError(address_type, 'State/Region')"/>
          <div class="error-icon-block">
            <ErrorIcon/>
          </div>
        </div>
        <!-- State/Region -->
        <SelectInput
          v-if="displayState && getRegionOptions(address_type).length"
          v-model="selectedAddressType.region_id"
          :options="getRegionOptions(address_type)"
          :error="getAddressFieldHasError(address_type, 'State/Region')"
          :label="$t('yourDetailsSection.deliverySection.addressForm.' +
          'regionField.label')"
          :required="getRegionRequired(address_type)"
          @change="setRegion($event)"
        />
        <!-- Postcode -->
        <div>
          <TextInput
            v-model="selectedAddressType.postcode"
            :error="getAddressFieldHasError(address_type, 'Postcode')"
            :class="{'field-valid': postCodeValid
            && selectedAddressType.postcode !== ''}"
            type="text"
            :placeholder="$t('yourDetailsSection.deliverySection.addressForm.' +
            'postCodeField.placeholder')"
            :label="$t('yourDetailsSection.deliverySection.addressForm.' +
            'postCodeField.label')"
            autocomplete="postal-code"
            :required="postcodeRequired(selectedAddressType.country_code)"
            @input="validatePostcode(address_type, true)"
            @focusout="validatePostcode(address_type, true)"
          />
          <ValidIcon v-if="postCodeValid && selectedAddressType.postcode !== ''"/>
          <div class="error-icon-block">
            <ErrorIcon/>
          </div>
          <ErrorMessage
            v-if="getAddressFieldHasError(address_type, 'Postcode')"
            :message="
            `${$t('errorMessages.postCodeErrorMessage')} ${selectedAddressType.country_code}`"
          />
        </div>
        <!-- Country -->
        <SelectInput
          v-model="selectedAddressType.country_code"
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
        <div v-if="isLoggedIn" class="save-address-field">
          <CheckboxComponent
            :id="`${address_type}-save-in-address-book`"
            :text="$t('saveNewAddress')"
            :checked="selectedAddressType.save_in_address_book === 1"
            @change="handleSaveInAddressBookChange"
          />
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
import TextInput from '@/components/Core/ActionComponents/Inputs/TextInput/TextInput.vue';
import SelectInput from '@/components/Core/ActionComponents/Inputs/Select/Select.vue';
import MyButton from '@/components/Core/ActionComponents/Button/Button.vue';
import ErrorMessage from '@/components/Core/ContentComponents/Messages/ErrorMessage/ErrorMessage.vue';
import ValidIcon from '@/components/Core/Icons/ValidIcon/ValidIcon.vue';
import ErrorIcon from '@/components/Core/Icons/ErrorIcon/ErrorIcon.vue';
import CheckboxComponent from '@/components/Core/ActionComponents/Inputs/Checkbox/Checkbox.vue';

// Stores
import { mapActions, mapState, mapWritableState } from 'pinia';
import useCustomerStore from '@/stores/CustomerStore';
import useConfigStore from '@/stores/ConfigStores/ConfigStore';

// Helpers
import deepClone from '@/helpers/addresses/deepClone';

export default {
  name: 'AddressForm',
  components: {
    TextInput,
    SelectInput,
    MyButton,
    ErrorMessage,
    ValidIcon,
    ErrorIcon,
    CheckboxComponent,
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
    selectedAddressType() {
      return this.selected[this.address_type];
    },
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
      'setAddressToStore',
      'setAddressAsEditing',
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
        this.setAddressAsEditing(this.address_type, false);

        // If the address type is shipping and the billing is set to use the same then update billing too.
        if (this.address_type === 'shipping' && this.selected.billing.same_as_shipping) {
          const clonedShipping = deepClone(this.selected.shipping);
          this.setAddressToStore(clonedShipping, 'billing');
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
      if (!this.selectedAddressType.country_code) {
        this.selectedAddressType.country_code = this.countryCode;
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
          this.selectedAddressType.region = region.option.name;
        } else {
          this.selectedAddressType.region = '';
          this.selectedAddressType.region_id = 0;
        }
      }
    },

    validateStreet(text) {
      let hasError = !text || (typeof text === 'string' && !text.trim());

      if (!hasError) {
        const streetAddress1 = this.selectedAddressType.street[0];
        const streetAddress2 = this.selectedAddressType.street[1];
        hasError = ([streetAddress1, streetAddress2].join(' ').length > 75);

        this.streetAddress1Valid = !hasError;
      }

      hasError
        ? this.addAddressError(this.address_type, 'Address Line 1')
        : this.removeAddressError(this.address_type, 'Address Line 1');
    },

    validateStreet2(text) {
      const streetAddress1 = this.selectedAddressType.street[0];
      const streetAddress2 = this.selectedAddressType.street[1];
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

    handleSaveInAddressBookChange(checked) {
      this.selectedAddressType.save_in_address_book = checked ? 1 : 0;
    },
  },
};
</script>
<style lang="scss" scoped>
@import "./styles.scss";
@import "@/styles/core/form.scss";
</style>
