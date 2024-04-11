<template>
  <div>
    <AdyenPaymentMethods
      id="adyen-dropin-container-new"
      :key="`adyenPayments-${adyenKey}`"
    />
  </div>
</template>

<script>
// Stores
import { mapActions, mapState } from 'pinia';
import useAdyenStore from '@/stores/PaymentStores/AdyenStore';
import useConfigStore from '@/stores/ConfigStores/ConfigStore';
import useCustomerStore from '@/stores/CustomerStore';

// Components
import AdyenPaymentMethods from '@/components/Steps/PaymentPage/Adyen/DropIn/PaymentMethods/PaymentMethods.vue';

export default {
  name: 'AdyenDropIn',
  components: {
    AdyenPaymentMethods,
  },
  data() {
    return {
      adyenKey: 0,
    };
  },
  computed: {
    ...mapState(useCustomerStore, [
      'customer',
      'isLoggedIn',
    ]),
    ...mapState(useConfigStore, ['currencyCode', 'locale']),
  },
  methods: {
    ...mapActions(useAdyenStore, ['clearPaymentReponseCache']),
    ...mapActions(useConfigStore, ['getInitialConfig']),
  },
};
</script>

<style lang="scss">
@import "./styles.scss";
</style>
