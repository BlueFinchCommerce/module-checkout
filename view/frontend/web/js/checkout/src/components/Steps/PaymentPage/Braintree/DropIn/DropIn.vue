<template>
  <ErrorMessage
    v-if="errorMessage"
    :message="errorMessage"
    :attached="false"
  />

  <div
    v-if="Object.values(vaultedMethods).length"
    class="braintree-payment__title"
  >
    <Payment
      class="braintree-payment__icon"
      fill="black"
    />
    <TextField
      class="braintree-payment__header"
      :text="storedStepText"
    />
    <div class="divider-line" />
  </div>

  <VaultedMethods v-if="isPaymentMethodAvailable('braintree_cc_vault')" />

  <div
    class="braintree-payment__title"
  >
    <Payment
      class="braintree-payment__icon"
      fill="black"
    />
    <TextField
      class="braintree-payment__header"
      :text="paymentStepText"
    />
    <div class="divider-line" />
  </div>
  <BraintreeNewMethods />
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
import Payment from '@/components/Core/Icons/Payment/Payment.vue';
import TextField from '@/components/Core/ContentComponents/TextField/TextField.vue';

export default {
  name: 'BraintreeDropIn',
  components: {
    BraintreeAch,
    BraintreeLpm,
    BraintreeNewMethods,
    ErrorMessage,
    VaultedMethods,
    Payment,
    TextField,
  },
  data() {
    return {
      paymentStepText: '',
      storedStepText: '',
    };
  },
  computed: {
    ...mapState(useBraintreeStore, [
      'errorMessage',
      'vaultedMethods',
    ]),
    ...mapState(usePaymentStore, [
      'isPaymentMethodAvailable',
    ]),
  },
  created() {
    // The titles need to be reflective of the state we're in.
    this.storedStepText = window.geneCheckout?.['gene-bettercheckout-paymentstep-text-stored']
        || this.$t('paymentStep.titleStored');

    if (Object.values(this.vaultedMethods).length) {
      this.paymentStepText = window.geneCheckout?.['gene-bettercheckout-paymentstep-text-new']
        || this.$t('paymentStep.titleNew');
    } else {
      this.paymentStepText = window.geneCheckout?.['gene-bettercheckout-paymentstep-text-guest']
        || this.$t('paymentStep.titleGuest');
    }
  },
};
</script>

<style lang="scss">
@import "@/components/Steps/PaymentPage/Braintree/DropIn/styles.scss";
</style>
