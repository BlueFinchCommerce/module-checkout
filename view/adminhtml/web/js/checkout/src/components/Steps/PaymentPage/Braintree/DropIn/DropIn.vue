<template>
  <ErrorMessage
    v-if="errorMessage"
    :message="errorMessage"
    :attached="false"
  />
  <VaultedMethods v-if="isPaymentMethodAvailable('braintree_cc_vault')" />
  <BraintreeNewMethods v-if="isPaymentMethodAvailable('braintree')" />
  <BraintreeLpm v-if="isPaymentMethodAvailable('braintree_local_payment')" />
  <BraintreeAch v-if="isPaymentMethodAvailable('braintree_ach_direct_debit')" />
</template>

<script>
// Stores
import { mapState } from 'pinia';
import useBraintreeStore from '@/stores/PaymentStores/BraintreeStore';
import usePaymentStore from '@/stores/PaymentStores/PaymentStore';

// Components
import BraintreeAch from '@/components/Steps/PaymentPage/Braintree/DropIn/BraintreeAch/BraintreeAch.vue';
import BraintreeLpm from '@/components/Steps/PaymentPage/Braintree/DropIn/BraintreeLpm/BraintreeLpm.vue';
import BraintreeNewMethods from '@/components/Steps/PaymentPage/Braintree/DropIn/NewMethods/NewMethods.vue';
import ErrorMessage from '@/components/Core/ContentComponents/Messages/ErrorMessage/ErrorMessage.vue';
import VaultedMethods from '@/components/Steps/PaymentPage/Braintree/DropIn/VaultedMethods/VaultedMethods.vue';

export default {
  name: 'BraintreeDropIn',
  components: {
    BraintreeAch,
    BraintreeLpm,
    BraintreeNewMethods,
    ErrorMessage,
    VaultedMethods,
  },
  computed: {
    ...mapState(useBraintreeStore, [
      'errorMessage',
    ]),
    ...mapState(usePaymentStore, [
      'isPaymentMethodAvailable',
    ]),
  },
};
</script>
