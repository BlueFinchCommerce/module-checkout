<template>
  <div class="address-list">
    <div
      v-if="displayTitle"
      class="delivery-section-title"
    >
      <Locate />
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
        :key="item.id"
        class="address-list__item"
        :class="{ active: item.id === selected[addressType].id }"
        @click="selectAddress(item)"
        data-cy="ship-here"
        @keydown="selectAddress(item)"
      >
        <Tick v-if="item.id === selected[addressType].id" />
        <TextField
          v-else-if="addressType =='shipping'"
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
        v-if="selected[addressType].id !== 'custom'"
        value=""
        class="address-list__item-new"
        data-cy="add-address-new"
        @click="newAddress"
        @keydown="newAddress"
        v-text="$t('addNewAddressBtn')"
      />
    </ul>
  </div>
</template>

<script>

// stores
import { mapActions, mapState } from 'pinia';
import useCustomerStore from '@/stores/CustomerStore';

// icons
import Locate from '@/components/Core/Icons/Locate/Locate.vue';
import Tick from '@/components/Core/Icons/Tick/Tick.vue';

// components
import TextField from '@/components/Core/TextField/TextField.vue';

// Helpers
import deepClone from '@/helpers/deepClone';

export default {
  name: 'AddressList',
  components: {
    Locate,
    TextField,
    Tick,
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
  computed: {
    ...mapState(useCustomerStore, ['customer', 'selected']),
  },
  mounted() {
    this.$emit('showAddressBlock', false);
  },
  methods: {
    ...mapActions(useCustomerStore, [
      'setAddress',
      'createNewAddress',
      'setEditing',
      'setAddressAsCustom',
    ]),
    selectAddress(address) {
      const clonedAddress = deepClone(address);
      this.setAddress(clonedAddress, this.addressType);
      this.setEditing(this.addressType, false);

      // If the billing address is set to match then update this too.
      if (this.selected.billing.same_as_shipping) {
        this.setAddress(clonedAddress, 'billing');
      }
    },
    newAddress() {
      this.createNewAddress(this.addressType);
    },
  },
};
</script>
<style lang="scss" scoped>
@import "./styles";
</style>
