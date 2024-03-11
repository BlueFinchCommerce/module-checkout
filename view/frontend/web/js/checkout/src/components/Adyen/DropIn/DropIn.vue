<template>
  <div class="adyen-payment__title">
    <Payment
      class="adyen-payment__icon"
      fill="black"
    />
    <TextField
      v-if="!storedPayments"
      class="adyen-payment__header"
      :text="paymentStepText"
    />
    <div class="divider-line"></div>
  </div>
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
import useAdyenStore from '@/stores/AdyenStore';
import useCartStore from '@/stores/CartStore';
import useConfigStore from '@/stores/ConfigStore';
import useCustomerStore from '@/stores/CustomerStore';
import useGtmStore from '@/stores/GtmStore';

// Components
import AdyenPaymentMethods from '@/components/Adyen/DropIn/PaymentMethods/PaymentMethods.vue';
import Payment from '@/components/Core/Icons/Payment/Payment.vue';
import TextField from '@/components/Core/TextField/TextField.vue';

export default {
  name: 'AdyenDropIn',
  components: {
    AdyenPaymentMethods,
    Payment,
    TextField,
  },
  data() {
    return {
      errorMessage: '',
      orderId: null,
      storedPaymentsId: 'adyen-dropin-container-stored',
      adyenKey: 0,
      storedKey: 0,
      paymentStepText: '',
      paymentStepTextId: 'gene-bettercheckout-paymentstep-text',
    };
  },
  computed: {
    ...mapState(useAdyenStore, ['adyenVaultEnabled', 'loadingPaymentMethods']),
    ...mapState(useCartStore, ['cartEmitter']),
    ...mapState(useCustomerStore, [
      'customer',
      'getSelectedBillingAddress',
      'getSelectedShippingAddress',
      'isLoggedIn',
    ]),
    ...mapState(useConfigStore, ['currencyCode', 'locale']),
  },
  async created() {
    await this.getStoreConfig();
    this.paymentStepText = window.geneCheckout?.[this.paymentStepTextId] || this.$t('paymentStep.title');

    this.cartEmitter.on('cartUpdated', () => {
      this.clearPaymentReponseCache();
      this.storedKey += 1;
      this.adyenKey += 1;
    });

    const gtmStore = useGtmStore();
    gtmStore.trackGtmEvent({
      event: 'checkoutOption',
      ecommerce: {
        checkout_option: {
          actionField: {
            step: 3,
            option: 'payment',
          },
        },
      },
    });
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
