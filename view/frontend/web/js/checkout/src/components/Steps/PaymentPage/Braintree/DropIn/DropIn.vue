<template>
  <BraintreeNewMethods />
  <BraintreeLpm v-if="isPaymentMethodAvailable('braintree_local_payment')" />
  <BraintreeAch v-if="isPaymentMethodAvailable('braintree_ach_direct_debit')" />
</template>

<script>
// Stores
import { mapState } from 'pinia';
import useCustomerStore from '@/stores/CustomerStore';
import usePaymentStore from '@/stores/PaymentStores/PaymentStore';

// Components
import BraintreeAch from '@/components/Steps/PaymentPage/Braintree/DropIn/BraintreeAch/BraintreeAch.vue';
import BraintreeLpm from '@/components/Steps/PaymentPage/Braintree/DropIn/BraintreeLpm/BraintreeLpm.vue';
import BraintreeNewMethods from '@/components/Steps/PaymentPage/Braintree/DropIn/NewMethods/NewMethods.vue';

export default {
  name: 'BraintreeDropIn',
  components: {
    BraintreeAch,
    BraintreeLpm,
    BraintreeNewMethods,
  },
  computed: {
    ...mapState(useCustomerStore, ['isLoggedIn']),
    ...mapState(usePaymentStore, [
      'isPaymentMethodAvailable',
    ]),
  },
};
</script>

<style lang="scss">
@import "@/components/Steps/PaymentPage/Braintree/DropIn/styles.scss";
</style>
