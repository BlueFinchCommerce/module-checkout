<template>
  <div>
    <AddressForm
      :address_type="address_type"
    />
  </div>
</template>

<script>
// Stores
import { mapState } from 'pinia';
import useCustomerStore from '@/stores/CustomerStore';

// Components
import AddressForm from '@/components/Steps/Addresses/AddressForms/Form/AddressForm.vue';

export default {
  name: 'ShippingForm',
  components: {
    AddressForm,
  },
  data() {
    return {
      address_type: 'shipping',
    };
  },
  computed: {
    ...mapState(useCustomerStore, ['selected']),

    formErrors() {
      return this.selected.formErrors;
    },
  },
};
</script>
