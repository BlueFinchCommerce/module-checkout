<template>
  <div v-if="addressFinder.afd.serial && addressFinder.afd.id">
    <div class="afd-postcode__container">
      <div class="afd-postcode__field">
        <TextInput type="text"
                   id="afd-postcode"
                   :class="{'field-valid': afdValid}"
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
        <ValidIcon v-if="afdValid"/>
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
      <div class="address-block">
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
import useConfigStore from '@/stores/ConfigStore';

// services
import afdPostcode from '@/services/afdPostcode';

// Components
import AddressBlock from '@/components/Steps/Addresses/AddressBlock/AddressBlock.vue';
import TextInput from '@/components/Core/Inputs/TextInput/TextInput.vue';
import MyButton from '@/components/Core/Button/Button.vue';

// Icons
import Search from '@/components/Core/Icons/Search/Search.vue';
import Edit from '@/components/Core/Icons/Edit/Edit.vue';
import ValidIcon from '@/components/Core/Icons/ValidIcon/ValidIcon.vue';

export default {
  name: 'AfdPostCode',
  components: {
    AddressBlock,
    TextInput,
    Search,
    Edit,
    MyButton,
    ValidIcon,
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
      afdValid: false,
    };
  },
  computed: {
    ...mapWritableState(useCustomerStore, ['selected']),
    ...mapState(useConfigStore, [
      'countryCode',
      'stateRequired',
      'countries',
      'addressFinder',
    ]),
  },
  async mounted() {
    await this.getAfdConfiguration();
  },
  methods: {
    ...mapActions(useCustomerStore, [
      'setAddress',
      'validateAddress',
      'validatePostcode',
      'setEditing',
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

      // Set afd valid
      this.afdValid = true;

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
        country_id: countryCode,
        region: region ? region.option.name : address.PostalCounty,
        region_id: region ? region.option.value : 0,
        postcode: address.Postcode,
      };
      this.setAddress(newAddress, this.address_type);
      this.updateRegionRequired(this.address_type);
      const isValid = this.validateAddress(this.address_type, true) && this.validatePostcode(this.address_type, true);

      // If the address we get back from AFD is not valid then open the form
      // allowing User's the ability to edit.
      if (!isValid) {
        this.setEditing(this.address_type, true);
      }
    },
  },
};
</script>
<style lang="scss" scoped>
@import "./styles.scss";
</style>
