<template>
  <div :class="loadingPaymentMethods ? 'text-loading' : ''">
    <AdyenPaymentMethods
      v-if="isLoggedIn && adyenVaultEnabled"
      :id="storedPaymentsId"
      :key="`storePayments-${storedKey}`"
      :stored-payments="true"
    />
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
import useCartStore from '@/stores/CartStore';
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
      errorMessage: '',
      orderId: null,
      storedPaymentsId: 'adyen-dropin-container-stored',
      adyenKey: 0,
      storedKey: 0,
    };
  },
  computed: {
    ...mapState(useAdyenStore, ['adyenVaultEnabled', 'loadingPaymentMethods']),
    ...mapState(useCartStore, ['cartEmitter']),
    ...mapState(useCustomerStore, [
      'customer',
      'isLoggedIn',
    ]),
    ...mapState(useConfigStore, ['currencyCode', 'locale']),
  },
  methods: {
    ...mapActions(useAdyenStore, ['clearPaymentReponseCache']),
    ...mapActions(useConfigStore, ['getStoreConfig']),
  },
};
</script>

<style lang="scss">
@import "./styles.scss";
</style>
