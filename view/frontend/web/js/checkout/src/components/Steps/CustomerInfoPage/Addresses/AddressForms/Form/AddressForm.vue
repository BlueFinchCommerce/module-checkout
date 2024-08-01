<template>
  <div class="address-form">
    <div class="address-form-fields">
      <form
        autocomplete="on"
        @submit.prevent="validateAndSave()"
      >
        <template
          v-for="(value, index) in validationItems.street.items[0].multiline_count"
          :key="index"
        >
          <div>
            <TextInput
              v-model="selectedAddressType.street[index]"
              type="text"
              :class="{'field-valid': selectedAddressType.street[index]
                        && isFieldValid(address_type, `street.${index}`),
                      'field-error': !isFieldValid(address_type, `street.${index}`)}"
              :error="showFieldError(address_type, `street.${index}`)"
              :error-message="showFieldError(address_type, `street.${index}`)
                ? $t('errorMessages.streetErrorMessage') : ''"
              :placeholder="$t(
                'yourDetailsSection.deliverySection.addressForm.addressField.placeholder',
                { line: index + 1 }
              )"
              :label="$t('yourDetailsSection.deliverySection.addressForm.addressField.label', { line: index + 1 })"
              autocomplete="address-line1"
              :required="isRequired(`street.${index}`)"
              :data-cy="`${address_type}-address-one-input`"
              @input="validateField(address_type, `street.${index}`, true)"
              @focusout="validateField(address_type, `street.${index}`, true)"
            />
            <ValidIcon v-if="selectedAddressType.street[index] && isFieldValid(address_type, `street.${index}`)" />
            <div class="error-icon-block">
              <ErrorIcon v-if="!isFieldValid(address_type, `street.${index}`)" />
            </div>
          </div>
        </template>
        <!-- City -->
        <div>
          <TextInput
            v-model="selectedAddressType.city"
            type="text"
            :class="{'field-valid': selectedAddressType.city && isFieldValid(address_type, 'city'),
                     'field-error': !isFieldValid(address_type, 'city')}"
            :error="showFieldError(address_type, 'city')"
            :error-message="showFieldError(address_type, 'city')
              ? $t('errorMessages.cityErrorMessage') : ''"
            :placeholder="$t('yourDetailsSection.deliverySection.addressForm.' +
              'cityField.placeholder')"
            :label="$t('yourDetailsSection.deliverySection.addressForm.' +
              'cityField.label')"
            :required="isRequired('city')"
            autocomplete="address-level2"
            :data-cy="`${address_type}-city-input`"
            @input="validateField(address_type, 'city', true)"
            @focusout="validateField(address_type, 'city', true)"
          />
          <ValidIcon v-if="selectedAddressType.city && isFieldValid(address_type, 'city')" />
          <div class="error-icon-block">
            <ErrorIcon v-if="!isFieldValid(address_type, 'city')" />
          </div>
        </div>
        <!-- Region -->
        <div v-if="displayState && !getRegionOptions(address_type).length">
          <TextInput
            v-model="selectedAddressType.region.region"
            :class="{'field-valid': selectedAddressType.region.region && isFieldValid(address_type, 'region')}"
            type="text"
            :error="showFieldError(address_type, 'region')"
            :error-message="showFieldError(address_type, 'region')
              ? $t('errorMessages.regionErrorMessage') : ''"
            :placeholder="$t('yourDetailsSection.deliverySection.addressForm.' +
              'regionField.placeholder')"
            :label="$t('yourDetailsSection.deliverySection.addressForm.' +
              'regionField.label')"
            autocomplete="address-level1"
            :data-cy="`${address_type}-region-input`"
            :required="getRegionRequired(address_type)"
            @input="validateRegion(address_type, true)"
            @focusout="validateRegion(address_type, true)"
          />
          <ValidIcon
            v-if="selectedAddressType.region.region && isFieldValid(address_type, 'region')"
          />
          <div class="error-icon-block">
            <ErrorIcon />
          </div>
        </div>
        <!-- State/Region -->
        <SelectInput
          v-if="displayState && getRegionOptions(address_type).length"
          v-model="selectedAddressType.region.region_id"
          :options="getRegionOptions(address_type)"
          :error="showFieldError(address_type, 'region')"
          :label="$t('yourDetailsSection.deliverySection.addressForm.' +
            'regionField.label')"
          :required="getRegionRequired(address_type)"
          :data-cy="`${address_type}-state-select`"
          @change="setRegion($event)"
        />
        <!-- Postcode -->
        <div>
          <TextInput
            v-model="selectedAddressType.postcode"
            :error="showFieldError(address_type, 'postcode')"
            :error-message="showFieldError(address_type, 'postcode')
              ? `${$t('errorMessages.postCodeErrorMessage')} ${selectedAddressType.country_code}` : ''"
            :class="{'field-valid': selectedAddressType.postcode && isFieldValid(address_type, 'postcode'),
                     'field-error': !isFieldValid(address_type, 'postcode')}"
            type="text"
            :placeholder="$t('yourDetailsSection.deliverySection.addressForm.' +
              'postCodeField.placeholder')"
            :label="$t('yourDetailsSection.deliverySection.addressForm.' +
              'postCodeField.label')"
            autocomplete="postal-code"
            :data-cy="`${address_type}-postcode-input`"
            :required="postcodeRequired(selectedAddressType.country_code)"
            @input="validateField(address_type, 'postcode', true)"
            @focusout="validateField(address_type, 'postcode', true)"
          />
          <ValidIcon v-if="selectedAddressType.postcode && isFieldValid(address_type, 'postcode')" />
          <div class="error-icon-block">
            <ErrorIcon v-if="!isFieldValid(address_type, 'postcode')" />
          </div>
        </div>
        <!-- Country -->
        <SelectInput
          v-model="selectedAddressType.country_code"
          :options="selectOptions"
          :error="showFieldError(address_type, 'country')"
          :label="$t('yourDetailsSection.deliverySection.addressForm.countryField.label')"
          :selected-option="$t('yourDetailsSection.selectPlaceholder')"
          required
          :data-cy="`${address_type}-country-select`"
          @change="countryUpdated($event)"
        />
        <ErrorMessage
          v-if="!isFieldValid(address_type, 'country')"
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
          <CheckboxComponent
            :id="`${address_type}-save-in-address-book`"
            :text="$t('saveNewAddress')"
            :checked="selectedAddressType.save_in_address_book === 1"
            :data-cy="`${address_type}-address-save-checkbox`"
            @change="handleSaveInAddressBookChange"
          />
        </div>
        <div>
          <MyButton
            v-if="address_type !== 'shipping'"
            class="select-address-btn"
            type="submit"
            primary
            :disabled="!isAddressValid(address_type)"
            :label="$t('yourDetailsSection.deliverySection' +
              '.addressForm.saveAddressButton')"
            :data-cy="`${address_type}-address-use-button`"
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
import useValidationStore from '@/stores/ConfigStores/ValidationStore';

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
      requiredErrorMessage: '',
    };
  },
  computed: {
    ...mapWritableState(useCustomerStore, ['selected', 'isLoggedIn', 'postCodeValid', 'inputsSanitiseError']),
    ...mapState(useConfigStore, ['countries', 'stateRequired', 'displayState',
      'countryCode', 'optionalZipCountries', 'postcodeRequired']),
    ...mapState(useValidationStore, ['isAddressValid', 'validationItems']),
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
    this.validateAddress(this.address_type);
  },
  methods: {
    ...mapActions(useCustomerStore, [
      'setAddressAsCustom',
      'setAddressToStore',
      'setAddressAsEditing',
      'addAddressError',
      'clearRegion',
      'updateRegionRequired',
    ]),
    ...mapActions(useValidationStore, [
      'isFieldValid',
      'showFieldError',
      'isRequired',
      'validateAddress',
      'validateField',
      'validateRegion',
    ]),
    validateAndSave() {
      this.requiredErrorMessage = '';
      const isValid = this.validateAddress(this.address_type, true);
      if (isValid) {
        this.setAddressAsCustom(this.address_type);
        this.setAddressAsEditing(this.address_type, false);

        // If the address type is shipping and the billing is set to use the same then update billing too.
        if (this.address_type === 'shipping' && this.selected.billing.same_as_shipping) {
          const clonedShipping = deepClone(this.selected.shipping);
          this.setAddressToStore(clonedShipping, 'billing');
        }
      }
    },

    setupCountry() {
      if (!this.selectedAddressType.country_code) {
        this.selectedAddressType.country_code = this.countryCode;
      }
    },

    countryUpdated() {
      this.clearRegion(this.address_type);
      this.updateRegionRequired(this.address_type);
      this.validateField(this.address_type, 'postcode', true);
      this.validateRegion(this.address_type, true);
    },

    setRegion(event) {
      const availableRegions = this.getRegionOptions(this.address_type);
      if (availableRegions.length) {
        const regionId = parseInt(event.target.value, 10);
        const region = availableRegions.find((rgion) => rgion.option.value === regionId);
        if (region) {
          this.selectedAddressType.region = {
            region: region.option.name,
            region_code: region.option.code,
            region_id: region.option.value,
          };
        } else {
          this.selectedAddressType.region = {
            region: '',
            region_code: '',
            region_id: 0,
          };
        }
      }
      this.validateRegion(this.address_type, true);
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
