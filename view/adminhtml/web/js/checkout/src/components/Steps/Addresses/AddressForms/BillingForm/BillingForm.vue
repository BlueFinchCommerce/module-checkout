<template>
  <div>
    <div
      class="billing-address-not-same"
    >
      <div
        class="address-block__checkbox"
      >
        <CheckboxComponent
          v-if="showCheckbox && isItemRequiringDelivery"
          :checked="selected[address_type].same_as_shipping"
          :text="$t('billingForm.notSameAddress')"
          @change="toggleBillingAddress"
        />
      </div>

      <TextField
        v-if="(!selected[address_type].same_as_shipping && !isClickAndCollect) || !isItemRequiringDelivery"
        class="address-block__title"
        :text="$t('yourDetailsSection.deliverySection.billingAddressTitle')"
      />

      <AddressList
        v-if="emailEntered && customer.addresses.length
          && (!selected[address_type].same_as_shipping || !isItemRequiringDelivery)"
        :display-title="false"
        address-type="billing"
      />

      <div
        v-if="!selected[address_type].editing
          && (!selected[address_type].same_as_shipping || isClickAndCollect || !isItemRequiringDelivery)
          && selected[address_type].postcode
          && !isUsingSavedBillingAddress"
        class="address-block"
      >
        <div class="address-block__item">
          <article>
            <AddressBlock
              :address_type="address_type"
              :address="selected[address_type]"
            />
          </article>
        </div>
        <div
          v-if="selected[address_type].id"
          class="address-block__edit"
          @click.prevent="editBillingAddress"
          @keydown.enter.prevent="editBillingAddress"
        >
          <Edit />
        </div>
      </div>
    </div>

    <template
      v-if="(!selected[address_type].id || (selected[address_type].id === 'custom'
        && selected[address_type].editing))
        && (!selected[address_type].same_as_shipping || isClickAndCollect || !isItemRequiringDelivery)"
    >
      <NameFields
        :address_type="address_type"
        @isCustomerInfoFull="isCustomerInfoFull"
      />

      <div class="billing-form-address">
        <div :class="!customerInfoValidation ? 'disabled' : ''">
          <Loqate
            v-if="!selected[address_type].id
              || (selected[address_type].id === 'custom' && selected[address_type].editing)"
            :address_type="address_type"
          />
        </div>

        <LinkComponent
          v-if="selected[address_type].id !== 'custom'"
          class="manually-button"
          :class="!customerInfoValidation ? 'disabled' : ''"
          :label="$t('yourDetailsSection.deliverySection.addressForm.linkText')"
          @click.prevent="editBillingAddress"
        />

        <AddressForm
          v-if="selected[address_type].editing"
          :address_type="address_type"
        />
      </div>
    </template>
  </div>
</template>

<script>
// Stores
import { mapActions, mapState } from 'pinia';
import useCartStore from '@/stores/CartStore';
import useCustomerStore from '@/stores/CustomerStore';
import useShippingMethodsStore from '@/stores/ShippingMethodsStore';

// Components
import TextField from '@/components/Core/TextField/TextField.vue';
import AddressForm from '@/components/Steps/Addresses/AddressForms/Form/AddressForm.vue';
import AddressBlock from '@/components/Steps/Addresses/AddressBlock/AddressBlock.vue';
import NameFields from '@/components/Steps/Addresses/AddressForms/Form/Name/Name.vue';
import CheckboxComponent from '@/components/Core/Inputs/Checkbox/Checkbox.vue';
import Loqate from '@/components/Steps/AddressDetails/Loqate/Loqate.vue';
import LinkComponent from '@/components/Core/Link/Link.vue';
import AddressList from '@/components/Steps/Addresses/AddressList/AddressList.vue';

// Icons
import Edit from '@/components/Core/Icons/Edit/Edit.vue';

// Helpers
import deepClone from '@/helpers/deepClone';

export default {
  name: 'BillingForm',
  components: {
    TextField,
    AddressForm,
    AddressBlock,
    Edit,
    NameFields,
    CheckboxComponent,
    Loqate,
    LinkComponent,
    AddressList,
  },
  props: {
    showCheckbox: {
      type: Boolean,
      default: true,
    },
  },
  emits: [
    'billingInfoFull',
  ],
  data() {
    return {
      address_type: 'billing',
      customerInfoValidation: false,
    };
  },
  computed: {
    ...mapState(useCustomerStore, ['customer', 'emailEntered', 'selected', 'isUsingSavedBillingAddress']),
    ...mapState(useCartStore, ['isLoggedIn', 'isItemRequiringDelivery']),
    ...mapState(useShippingMethodsStore, ['isClickAndCollect']),
  },
  methods: {
    ...mapActions(useCustomerStore, [
      'setEditing',
      'createNewAddress',
      'submitCustom',
      'setAddressAsCustom',
    ]),
    toggleBillingAddress(event) {
      if (!event.target.checked) {
        this.createNewAddress(this.address_type);
        this.selected[this.address_type].same_as_shipping = false;
      } else {
        this.selected[this.address_type] = deepClone(this.selected.shipping);
        this.selected[this.address_type].same_as_shipping = true;
        this.setEditing(this.address_type, false);
      }
    },
    editBillingAddress() {
      this.setEditing(this.address_type, true);
    },
    isCustomerInfoFull(value) {
      this.customerInfoValidation = value;
      this.$emit('billingInfoFull', value);
    },
  },
};
</script>

<style lang="scss" scoped>
@import "./styles.scss";
</style>
