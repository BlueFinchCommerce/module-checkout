<template>
  <div class="address-list">
    <div
      v-if="displayTitle"
      class="delivery-section-title"
    >
      <img
        :src="savedAddressIconUrl"
        alt="saved-address-icon"
      >
      <div class="delivery-section-title-text">
        <TextField
          :text="$t('yourDetailsSection.deliverySection.savedAddressesTitle', { addressType })"
        />
      </div>
      <div class="divider-line"></div>
    </div>
    <ul class="address-list__list">
      <li
        v-for="(item) in customer.addresses"
        tabindex="0"
        :key="item.id"
        class="address-list__item"
        :class="{ active: item.id === selected[addressType].id }"
        @click="selectAddress(item)"
        data-cy="ship-here"
        @keydown="selectAddress(item)"
      >
        <Tick v-if="item.id === selected[addressType].id" />
        <TextField
          v-else-if="addressType ==='shipping'"
          class="ship-here"
          :text="$t('yourDetailsSection.deliverySection.shipHere')"
        />
        {{ item.firstname }} {{ item.lastname }}<br><br>
        {{ item.street[0] }}<br v-if="item.street[0]">
        {{ item.street[1] }}<br v-if="item.street[1]">
        {{ item.city }}<br v-if="item.city">
        {{ item.postcode }}<br v-if="item.postcode">
        {{ item.telephone }}
      </li>
      <li
        v-if="selected[addressType].id !== 'custom' && isShippingNewCTA"
        class="address-list__item-new">
        <MyButton
          type="button"
          secondary
          :label="$t('addNewAddressBtn')"
          @click="newAddress"
        />
      </li>
    </ul>
  </div>
</template>

<script>

// stores
import { mapActions, mapState } from 'pinia';
import useCustomerStore from '@/stores/CustomerStore';

// icons
import Tick from '@/components/Core/Icons/Tick/Tick.vue';
import promoSvg from '@/components/Steps/GlobalComponents/OrderSummary/PromotionComponent/images/promo-icon.svg';

// components
import TextField from '@/components/Core/ContentComponents/TextField/TextField.vue';
import MyButton from '@/components/Core/ActionComponents/Button/Button.vue';

// Helpers
import deepClone from '@/helpers/addresses/deepClone';
import getStaticUrl from '@/helpers/storeConfigs/getStaticPath';

export default {
  name: 'AddressList',
  components: {
    TextField,
    Tick,
    MyButton,
  },
  props: {
    addressType: {
      type: String,
      default: 'shipping',
    },
    displayTitle: {
      type: Boolean,
      default: true,
    },
  },
  data() {
    return {
      isShippingNewCTA: true,
    };
  },
  computed: {
    ...mapState(useCustomerStore, ['customer', 'selected']),
    savedAddressIconUrl() {
      return `${getStaticUrl(promoSvg)}`;
    },
  },
  mounted() {
    this.$emit('showAddressBlock', false);

    let selectedId = null;

    const selectedItem = this.customer.addresses.find((item) => item.id === this.selected[this.addressType].id);

    if (selectedItem) {
      selectedId = selectedItem.id;
    }

    this.$emit('passSelectedItemId', selectedId);
  },
  methods: {
    ...mapActions(useCustomerStore, [
      'setAddressToStore',
      'createNewAddress',
      'setAddressAsEditing',
      'setAddressAsCustom',
      'createNewBillingAddress',
    ]),
    selectAddress(address) {
      const clonedAddress = deepClone(address);
      this.setAddressToStore(clonedAddress, this.addressType);
      this.setAddressAsEditing(this.addressType, false);

      // If the billing address is set to match then update this too.
      if (this.selected.billing.same_as_shipping) {
        this.setAddressToStore(clonedAddress, 'billing');
      }

      this.$emit('selectedSavedAddress', true);
      this.$emit('passSelectedItemId', address.id);

      if (this.addressType === 'billing') {
        this.isShippingNewCTA = true;
      }
    },
    newAddress() {
      this.isShippingNewCTA = false;

      if (this.selected[this.addressType].region_id !== null) {
        this.selected[this.addressType].region_id = null;
      }

      if (this.addressType === 'billing') {
        this.createNewBillingAddress('billing');
        this.setAddressAsCustom('billing');
        this.setAddressAsEditing('billing', true);
      } else {
        this.createNewAddress(this.addressType);
      }
    },
  },
};
</script>
<style lang="scss" scoped>
@import "./styles";
</style>
