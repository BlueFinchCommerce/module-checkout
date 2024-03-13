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

      <div class="address-block__title"
           v-if="(!selected[address_type].same_as_shipping && !isClickAndCollect) || !isItemRequiringDelivery">
       <div class="address-block__title-with-icon">
         <BillingAddressIcon/>
         <TextField
           class="address-block__title"
           :text="$t('yourDetailsSection.deliverySection.billingAddressTitle')"
         />
       </div>
        <div class="divider-line"></div>
      </div>

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
        <div>
          <AddressFinder
            v-if="!selected[address_type].id
              || (selected[address_type].id === 'custom' && selected[address_type].editing)"
            :address_type="address_type"
          />
        </div>

        <AddressForm
          v-if="selected[address_type].editing || !addressFinder.enabled"
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
import useConfigStore from '@/stores/ConfigStore';
import useCustomerStore from '@/stores/CustomerStore';
import useShippingMethodsStore from '@/stores/ShippingMethodsStore';

// Components
import TextField from '@/components/Core/TextField/TextField.vue';
import AddressForm from '@/components/Steps/Addresses/AddressForms/Form/AddressForm.vue';
import AddressBlock from '@/components/Steps/Addresses/AddressBlock/AddressBlock.vue';
import NameFields from '@/components/Steps/Addresses/AddressForms/Form/Name/Name.vue';
import CheckboxComponent from '@/components/Core/Inputs/Checkbox/Checkbox.vue';
import AddressFinder from '@/components/Steps/AddressFinder/AddressFinder.vue';
import AddressList from '@/components/Steps/Addresses/AddressList/AddressList.vue';

// Icons
import Edit from '@/components/Core/Icons/Edit/Edit.vue';
import BillingAddressIcon from '@/components/Core/Icons/BillingAddressIcon/BillingAddressIcon.vue';

// Helpers
import deepClone from '@/helpers/deepClone';

export default {
  name: 'BillingForm',
  components: {
    BillingAddressIcon,
    TextField,
    AddressForm,
    AddressBlock,
    Edit,
    NameFields,
    CheckboxComponent,
    AddressFinder,
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
    ...mapState(useCartStore, ['isLoggedIn', 'isItemRequiringDelivery']),
    ...mapState(useConfigStore, ['addressFinder']),
    ...mapState(useCustomerStore, ['customer', 'emailEntered', 'selected', 'isUsingSavedBillingAddress']),
    ...mapState(useShippingMethodsStore, ['isClickAndCollect']),
  },
  methods: {
    ...mapActions(useCustomerStore, [
      'setAddressAsEditing',
      'createNewAddress',
      'submitCustom',
      'setAddressAsCustom',
    ]),
    toggleBillingAddress(event) {
      if (!event.target.checked) {
        this.createNewAddress(this.address_type);
        this.selected[this.address_type].same_as_shipping = false;
        this.setAddressAsEditing(this.address_type, true);
      } else {
        this.selected[this.address_type] = deepClone(this.selected.shipping);
        this.selected[this.address_type].same_as_shipping = true;
        this.setAddressAsEditing(this.address_type, false);
      }
    },
    editBillingAddress() {
      this.setAddressAsEditing(this.address_type, true);
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
