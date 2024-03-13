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
import useBraintreeStore from '@/stores/BraintreeStore';
import usePaymentStore from '@/stores/PaymentStore';

// Components
import BraintreeAch from '@/components/Braintree/DropIn/BraintreeAch/BraintreeAch.vue';
import BraintreeLpm from '@/components/Braintree/DropIn/BraintreeLpm/BraintreeLpm.vue';
import BraintreeNewMethods from '@/components/Braintree/DropIn/NewMethods/NewMethods.vue';
import ErrorMessage from '@/components/Core/Messages/ErrorMessage/ErrorMessage.vue';
import VaultedMethods from '@/components/Braintree/DropIn/VaultedMethods/VaultedMethods.vue';

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
