<template>
  <div class="address-list">
    <div
      v-if="displayTitle"
      class="delivery-section-title"
    >
      <Shipping v-if="addressType === 'shipping'"
        :data-cy="`saved-${addressType}-address-icon`"
      />
      <BillingAddressIcon v-if="addressType === 'billing'"
        :data-cy="`saved-${addressType}-address-icon`"
      />
      <div class="delivery-section-title-text">
        <TextField
          :text="$t('Select a saved {addressType} address').replace('{addressType}', addressType)"
          :data-cy="`saved-${addressType}-address-title`"
        />
      </div>
      <div class="divider-line"></div>
    </div>
    <ul class="address-list__list">
      <li
        v-for="(item) in uniqueAddressList"
        tabindex="0"
        :key="item.id"
        class="address-list__item"
        :class="{ active: item.id === selected[addressType].id }"
        @click="selectAddress(item)"
        :data-cy="`${addressType}-saved-address`"
        @keydown="selectAddress(item)"
      >
        <Tick v-if="item.id === selected[addressType].id"
        :data-cy="`${addressType}-saved-address-active`"
        />
        <TextField
          v-else-if="addressType ==='shipping'"
          class="ship-here"
          :data-cy="`${addressType}-saved-address-ship-here`"
          :text="$t('Ship here')"
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
          :label="addNewAddressButtonText"
          :data-cy="`${addressType}-add-new-address-button`"
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
import useCartStore from '@/stores/CartStore';
import useValidationStore from '@/stores/ConfigStores/ValidationStore';

// icons
import Tick from '@/components/Core/Icons/Tick/Tick.vue';
import BillingAddressIcon from '@/components/Core/Icons/BillingAddressIcon/BillingAddressIcon.vue';
import Shipping from '@/components/Core/Icons/Shipping/Shipping.vue';

// components
import TextField from '@/components/Core/ContentComponents/TextField/TextField.vue';
import MyButton from '@/components/Core/ActionComponents/Button/Button.vue';

// Helpers
import deepClone from '@/helpers/addresses/deepClone';

export default {
  name: 'AddressList',
  components: {
    TextField,
    Tick,
    MyButton,
    BillingAddressIcon,
    Shipping,
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
      uniqueAddressList: [],
      addNewAddressButtonText: '',
      addNewAddressButtonTextId: 'bluefinch-checkout-addnewaddress-button-text',
    };
  },
  computed: {
    ...mapState(useCustomerStore, ['customer', 'selected']),
    ...mapState(useCartStore, ['cart']),
  },
  watch: {
    addressType: {
      immediate: true,
      handler(newVal) {
        if (newVal === 'billing') {
          // When the addressType changes to 'billing', select the new billing address or the first address
          this.selectCorrectAddress();
        }
      },
    },
  },
  mounted() {
    this.$emit('showAddressBlock', false);

    const uniqueAddresses = {};
    // Iterate through the addresses
    this.customer.addresses.forEach((address) => {
      // Create a unique identifier based on relevant fields
      const identifier = `${address.city}-${address.postcode}-${address.street.join('-')}`;
      // Check if the identifier already exists
      if (!uniqueAddresses[identifier]) {
        // If it doesn't exist, add it to the object
        uniqueAddresses[identifier] = true;
        // Add the address to the final list
        this.uniqueAddressList.push(address);
      }
    });

    this.addNewAddressButtonText = window.bluefinchCheckout?.[this.addNewAddressButtonTextId]
      || this.$t('+ Add new address');
  },
  methods: {
    ...mapActions(useCustomerStore, [
      'setAddressToStore',
      'createNewAddress',
      'setAddressAsEditing',
      'setAddressAsCustom',
      'createNewBillingAddress',
      'setSelectedSavedAddress',
    ]),
    ...mapActions(useValidationStore, ['removeAddressError']),

    selectCorrectAddress() {
      if (this.cart.billing_address) {
        this.selectAddress(this.cart.billing_address);
      } else if (this.customer.addresses.length > 0) {
        const firstItem = this.customer.addresses[0];
        this.selectAddress(firstItem);
      }
    },
    selectAddress(address) {
      const clonedAddress = deepClone(address);
      this.setAddressToStore(clonedAddress, this.addressType);
      this.setAddressAsEditing(this.addressType, false);

      // If the billing address is set to match then update this too.
      if (this.selected.billing.same_as_shipping) {
        this.setAddressToStore(clonedAddress, 'billing');
      }

      this.setSelectedSavedAddress(this.addressType, true);
      this.$emit('passSelectedItemId', address.id);

      this.isShippingNewCTA = true;
    },
    newAddress() {
      this.isShippingNewCTA = false;

      // Remove postcode error from new address form if saved address has an error.
      this.removeAddressError(this.addressType, 'postcode');

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
