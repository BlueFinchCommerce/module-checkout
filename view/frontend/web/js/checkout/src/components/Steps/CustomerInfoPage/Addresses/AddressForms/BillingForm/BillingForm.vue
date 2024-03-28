<template>
  <div>
    <div
      class="billing-address-not-same"
    >
      <div
        class="address-block__checkbox"
      >
        <CheckboxComponent
          v-if="showCheckbox && !cart.is_virtual"
          :checked="selected[address_type].same_as_shipping"
          :text="$t('billingForm.notSameAddress')"
          @change="toggleBillingAddress"
        />
      </div>

      <div class="address-block__title"
           v-if="customer.addresses.length > 0
           && (!selected[address_type].same_as_shipping && !isClickAndCollect)
           || cart.is_virtual">
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
          && (!selected[address_type].same_as_shipping || cart.is_virtual)"
        :display-title="false"
        address-type="billing"
      />

      <div
        v-if="!selected[address_type].editing
          && (!selected[address_type].same_as_shipping || isClickAndCollect || cart.is_virtual)
          && selected[address_type].id
          && !isUsingSavedBillingAddress"
        class="address-block"
        :class="customer.addresses.length > 0 ? 'saved-address-active' : ''"
      >
        <TextField
          class="address-block__title selected"
          :text="$t('yourDetailsSection.deliverySection.selectedBillingAddressTitle')"
        />
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
          :aria-label="$t('yourDetailsSection.deliverySection.editButton')"
          tabindex="0"
          @click.prevent="editBillingAddress"
          @keydown.enter.prevent="editBillingAddress"
        >
          <Edit />
        </div>
      </div>
    </div>

    <template v-if="
       ((customer.addresses.length > 0
       ? (!selected[address_type].id && !savedAddressActive) : !selected[address_type].id)
      || (selected[address_type].id === 'custom' && selected[address_type].editing))
      && (!selected[address_type].same_as_shipping || isClickAndCollect || cart.is_virtual)">

      <div class="address-block__title-with-icon billing">
        <Locate />
        <TextField
          class="address-block__title"
          :text="$t('yourDetailsSection.deliverySection.newAddressTitle')"
        />
        <div class="divider-line"></div>
      </div>
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
import useConfigStore from '@/stores/ConfigStores/ConfigStore';
import useCustomerStore from '@/stores/CustomerStore';
import useShippingMethodsStore from '@/stores/ShippingMethodsStore';

// Components
import TextField from '@/components/Core/ContentComponents/TextField/TextField.vue';
import AddressForm from '@/components/Steps/CustomerInfoPage/Addresses/AddressForms/Form/AddressForm.vue';
import AddressBlock from '@/components/Steps/CustomerInfoPage/Addresses/AddressBlock/AddressBlock.vue';
import NameFields from '@/components/Steps/CustomerInfoPage/Addresses/AddressForms/Form/Name/Name.vue';
import CheckboxComponent from '@/components/Core/ActionComponents/Inputs/Checkbox/Checkbox.vue';
import AddressFinder from '@/components/Steps/CustomerInfoPage/AddressFinder/AddressFinder.vue';
import AddressList from '@/components/Steps/CustomerInfoPage/Addresses/AddressList/AddressList.vue';

// Icons
import Edit from '@/components/Core/Icons/Edit/Edit.vue';
import BillingAddressIcon from '@/components/Core/Icons/BillingAddressIcon/BillingAddressIcon.vue';
import Locate from '@/components/Core/Icons/Locate/Locate.vue';

// Helpers
import deepClone from '@/helpers/addresses/deepClone';

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
    Locate,
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
      savedAddressActive: false,
    };
  },
  computed: {
    ...mapState(useCartStore, ['cart', 'isLoggedIn']),
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
        if (this.customer.addresses.length > 0) {
          this.savedAddressActive = true;
        }
        this.createNewAddress(this.address_type);
        this.selected[this.address_type].same_as_shipping = false;
        this.setAddressAsEditing(this.address_type, true);
      } else {
        this.savedAddressActive = false;
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
