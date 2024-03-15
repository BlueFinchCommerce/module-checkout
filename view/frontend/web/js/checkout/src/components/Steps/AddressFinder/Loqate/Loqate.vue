<template>
  <div class="loqate__container">
    <div class="loqate__field">
      <TextInput
        id="loqate"
        :class="{'field-valid': loqateValid}"
        v-model="query"
        type="text"
        :placeholder="$t('yourDetailsSection.deliverySection.addressFinder.placeholder')"
        :label="$t('yourDetailsSection.deliverySection.addressFinder.title')"
        class="loqate__input"
        autocomplete="postal-code"
        @blur="onBlur"
        @focus="onFocus"
        @input="getSuggestions"
        @keydown.down="onArrowDown"
        @keydown.up="onArrowUp"
        @keydown.enter="onEnter"
      />
      <ValidIcon v-if="loqateValid"/>
      <Search stroke="black" />
    </div>

    <ul
      v-if="getResultsCount() > 0"
      class="loqate__results"
    >
      <li
        v-for="(item, i) in addressList"
        :key="i"
        :class="{ 'locate__suggestion--active': i === arrowCounter }"
        class="loqate__result"
      >
        <button
          tabindex="-1"
          type="button"
          class="loqate__action"
          @click="selectSuggestion(item);"
        >
          {{ item.Text }} - {{ item.Description }}
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
        @click.prevent="editAddress"
        @keydown.prevent="editAddress"
      >
        <Edit />
        <MyButton
          :label="$t('yourDetailsSection.editButton')"
          secondary
        />
      </div>
    </div>
  </template>
</template>

<script>
// Stores
import { mapState, mapWritableState, mapActions } from 'pinia';
import useCustomerStore from '@/stores/CustomerStore';
import useConfigStore from '@/stores/ConfigStore';

// services
import loqate from '@/services/loqate';

// Components
import AddressBlock from '@/components/Steps/Addresses/AddressBlock/AddressBlock.vue';
import TextInput from '@/components/Core/Inputs/TextInput/TextInput.vue';
import MyButton from '@/components/Core/Button/Button.vue';

// Icons
import Search from '@/components/Core/Icons/Search/Search.vue';
import Edit from '@/components/Core/Icons/Edit/Edit.vue';
import ValidIcon from '@/components/Core/Icons/ValidIcon/ValidIcon.vue';
import selectAddressDataLayer from '@/helpers/dataLayer/selectAddressDataLayer';

export default {
  name: 'LoqateAddress',
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
      displayResults: false,
      loqateValid: false,
    };
  },
  computed: {
    ...mapWritableState(useCustomerStore, ['selected', 'customer']),
    ...mapState(useConfigStore, ['countryCode', 'stateRequired', 'countries']),
  },
  methods: {
    ...mapActions(useConfigStore, ['getRegionsByCountry']),
    ...mapActions(useCustomerStore, [
      'setAddressToStore',
      'validateAddress',
      'validatePostcode',
      'updateRegionRequired',
      'setAddressAsEditing',
    ]),
    editAddress() {
      this.address = false;
    },
    resetAddressData() {
      this.addressList = [];
      this.arrowCounter = -1;
      this.address = false;
    },
    getSuggestions(containerQuery) {
      this.resetAddressData();
      loqate.getSuggestions(containerQuery, this.query, this.address_type).then((addresses) => {
        this.addressList = addresses;
      });
    },
    selectSuggestion(item) {
      this.arrowCounter = -1;
      this.addressList = [];
      // Single Address
      if (item.Type === 'Address') {
        loqate.getAndUseAddress(item.Id).then(this.updateAddress);

        // Set loqate valid
        this.loqateValid = true;

        // Hide the list after selecting an item.
        this.displayResults = false;

        selectAddressDataLayer(this.address_type);
      } else {
        // Re run the search
        this.query = item.Text;
        loqate.getSuggestions(item.Id, this.query).then((addresses) => {
          this.addressList = addresses;
        });
      }
    },
    onBlur(event) {
      // Only hide results if the relatedTarget of the blur isn't because of clicking on
      // one of the results.
      if (!event.relatedTarget || !event.relatedTarget.classList.contains('afd-postcode__action')) {
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
    updateAddress(address) {
      let countryCode = '';
      if (
        address.CountryIso2 === 'GG'
          || address.CountryIso2 === 'IM'
          || address.CountryIso2 === 'JE'
      ) {
        countryCode = this.countryCode;
      } else {
        countryCode = address.CountryIso2;
      }

      const availableRegions = this.getRegionsByCountry(countryCode);
      const region = availableRegions.length && availableRegions.find((rgin) => (
        rgin.option.name === address.PostalCounty || rgin.option.name === address.ProvinceName
      ));

      const newAddress = {
        id: 'custom',
        company: address.Company,
        street: [address.Line1, address.Line2],
        city: address.City,
        country_code: countryCode,
        region: region ? region.option.name : address.ProvinceName,
        region_id: region ? region.option.value : 0,
        postcode: address.PostalCode,
      };
      this.setAddressToStore(newAddress, this.address_type);
      this.updateRegionRequired(this.address_type);
      const isValid = this.validateAddress(this.address_type, true) && this.validatePostcode(this.address_type, true);

      // If the address we get back from AFD is not valid then open the form
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
