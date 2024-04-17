<template>
  <div v-if="addressFinder.afd.serial && addressFinder.afd.id">
    <div class="afd-postcode__container">
      <div class="afd-postcode__field">
        <TextInput type="text"
                   id="afd-postcode"
                   v-model="query"
                   :placeholder="$t('yourDetailsSection.deliverySection.addressFinder.placeholder')"
                   :label="$t('yourDetailsSection.deliverySection.addressFinder.label')"
                   class="afd-postcode__input"
                   autocomplete="postal-code"
                   @blur="onBlur"
                   @focus="onFocus"
                   @input="getSuggestions"
                   @keydown.down="onArrowDown"
                   @keydown.up="onArrowUp"
                   @keydown.enter="onEnter"/>
        <Search stroke="black"/>
      </div>

      <ul
        v-if="getResultsCount() > 0 && displayResults"
        class="afd-postcode__results"
      >
        <li
          v-for="(item, i) in addressList"
          :key="i"
          :class="{ 'afdPostcode__suggestion--active': i === arrowCounter }"
          tabindex="-1"
          class="afd-postcode__result"
        >
          <button
            tabindex="-1"
            type="button"
            class="afd-postcode__action"
            @click="selectSuggestion(item);"
          >
            {{ item.List }}
          </button>
        </li>
      </ul>
    </div>

    <template v-if="address">
      <div class="address-block"
           :class="customer.addresses.length > 0 ? 'saved-address-active' : ''">
        <div class="address-block__item">
          <article>
            <AddressBlock
              :address_type="address_type"
              :address="address"
            />
          </article>
        </div>
        <div
          class="address-block__edit"
          tabindex="0"
          :aria-label="$t('yourDetailsSection.deliverySection.editButton')"
          @click.prevent="editAddress"
          @keydown.enter.prevent="editAddress"
        >
          <Edit />
          <MyButton
            secondary
            :label="$t('yourDetailsSection.editButton')"
          />
        </div>
      </div>
    </template>
  </div>
</template>

<script>
// Stores
import { mapState, mapWritableState, mapActions } from 'pinia';
import useCustomerStore from '@/stores/CustomerStore';
import useConfigStore from '@/stores/ConfigStores/ConfigStore';

// services
import afdPostcode from '@/services/addresses/afdPostcode';

// Components
import AddressBlock from '@/components/Steps/CustomerInfoPage/Addresses/AddressBlock/AddressBlock.vue';
import TextInput from '@/components/Core/ActionComponents/Inputs/TextInput/TextInput.vue';
import MyButton from '@/components/Core/ActionComponents/Button/Button.vue';

// Icons
import Search from '@/components/Core/Icons/Search/Search.vue';
import Edit from '@/components/Core/Icons/Edit/Edit.vue';

export default {
  name: 'AfdPostCode',
  components: {
    AddressBlock,
    TextInput,
    Search,
    Edit,
    MyButton,
  },
  props: {
    address_type: {
      type: String,
      default: 'shipping',
    },
  },
  data() {
    return {
      query: '',
      addressList: [],
      arrowCounter: -1,
      address: false,
      request: null,
      displayResults: true,
    };
  },
  computed: {
    ...mapWritableState(useCustomerStore, ['selected', 'customer']),
    ...mapState(useConfigStore, [
      'countryCode',
      'stateRequired',
      'countries',
      'addressFinder',
    ]),
    selectedAddressType() {
      return this.selected[this.address_type];
    },
  },
  async mounted() {
    await this.getAfdConfiguration();
  },
  methods: {
    ...mapActions(useCustomerStore, [
      'setAddressToStore',
      'validateNameField',
      'validatePhone',
      'validateAddress',
      'validatePostcode',
      'setAddressAsEditing',
      'getRegionOptions',
      'updateRegionRequired',
      'getAfdConfiguration',
    ]),

    editAddress() {
      this.address = false;
    },
    resetAddressData() {
      this.addressList = [];
      this.arrowCounter = -1;
      this.address = false;
    },
    onBlur({ relatedTarget }) {
      // Only hide results if the relatedTarget of the blur isn't because of clicking on
      // one of the results.
      if (!relatedTarget) {
        this.displayResults = false;
      } else if (!Array.from(relatedTarget.classList).some((c) => c.startsWith('afd-postcode__'))) {
        this.displayResults = false;
      }
    },
    onFocus() {
      // On focus show the list of results.
      this.displayResults = true;
    },
    onArrowDown() {
      if (this.arrowCounter < this.addressList.length) {
        this.arrowCounter += 1;
      }
    },
    onArrowUp() {
      if (this.arrowCounter > 0) {
        this.arrowCounter -= 1;
      }
    },
    onEnter() {
      this.selectSuggestion(this.addressList[this.arrowCounter]);
    },
    getResultsCount() {
      return this.addressList && this.addressList.length;
    },
    getSuggestions() {
      this.resetAddressData();
      afdPostcode.getSuggestions(this.query, this.address_type).then((addresses) => {
        this.addressList = addresses;
      });
    },
    selectSuggestion(item) {
      this.arrowCounter = -1;
      this.addressList = [];

      // Single Address
      afdPostcode.getAndUseAddress(item.Key, this.address_type).then(this.updateAddress);

      // Hide the list after selecting an item.
      this.displayResults = false;
    },
    updateAddress(address) {
      const {
        two_letter_abbreviation:
          /* eslint-disable  camelcase */
          countryCode = '',
      } = this.countries.find(({ three_letter_abbreviation }) => (
        /* eslint-disable  camelcase */
        address.CountryISO === three_letter_abbreviation
      ));

      const availableRegions = this.getRegionOptions(this.address_type);
      const region = availableRegions.length && availableRegions.find((rgin) => {
        const regionName = rgin.option.name;
        const regionCode = rgin.option.code;
        return regionName === address.PostalCounty || regionCode === address.AbbreviatedPostalCounty;
      });

      const line1 = address.Property || address.Street || address.Organisation;
      const line2 = address.Property ? address.Street : address.Locality;

      const newAddress = {
        id: 'custom',
        company: address.Organisation,
        street: [line1, line2],
        city: address.Town,
        country_code: countryCode,
        region: {
          region: region ? region.option.code : address.PostalCounty,
          ...(region ? { region_id: region.option.value } : {}),
        },
        postcode: address.Postcode,
      };
      this.setAddressToStore(newAddress, this.address_type);
      this.updateRegionRequired(this.address_type);
      this.setAddressToStore(newAddress, this.address_type);

      const firstNameValid = this.validateNameField(
        this.address_type,
        'First name',
        this.selectedAddressType.firstname,
        true,
      );
      const lastNameValid = this.validateNameField(
        this.address_type,
        'Last name',
        this.selectedAddressType.lastname,
        true,
      );
      const phoneNumberValid = this.validatePhone(
        this.address_type,
        this.selectedAddressType.telephone,
        true,
      );
      const addressValid = this.validateAddress(this.address_type, true);
      const postcodeValid = this.validatePostcode(this.address_type, true);

      const isValid = firstNameValid && lastNameValid && phoneNumberValid && addressValid && postcodeValid;

      // If the address we get back from AFD is not valid or details are not filled in then open the form
      // allowing User's the ability to edit.
      if (!isValid) {
        this.setAddressAsEditing(this.address_type, true);
      }
    },
  },
};
</script>
<style lang="scss" scoped>
@import "./styles.scss";
</style>
