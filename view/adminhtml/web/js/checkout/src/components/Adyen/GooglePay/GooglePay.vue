<template>
  <div
    id="adyen-google-pay"
    :class="!googlePayLoaded ? 'text-loading' : ''"
  />
</template>

<script>
import { mapState } from 'pinia';
import useCartStore from '@/stores/CartStore';
import useConfigStore from '@/stores/ConfigStore';
import usePaymentStore from '@/stores/PaymentStore';
import useShippingMethodsStore from '@/stores/ShippingMethodsStore';

import ErrorMessage from '@/components/Core/Messages/ErrorMessage/ErrorMessage.vue';
import Loader from '@/components/Core/Loader/Loader.vue';

export default {
  name: 'AdyenGooglePay',
  components: {
    ErrorMessage,
    Loader,
  },
  data() {
    return {
      browserInfo: {},
      googlePayNoShippingMethods: '',
      orderId: null,
      googlePayLoaded: false,
    };
  },
  computed: {
    ...mapState(useCartStore, ['cartGrandTotal']),
    ...mapState(useShippingMethodsStore, ['selectedMethod']),
    ...mapState(useConfigStore, [
      'currencyCode',
      'locale',
      'countryCode',
      'stateRequired',
      'countries',
      'getStoreConfig',
    ]),
    ...mapState(usePaymentStore, ['errorMessage']),
  },
  mounted() {
    const googlePayScript = document.createElement('script');
    googlePayScript.setAttribute('src', 'https://pay.google.com/gp/p/js/pay.js');
    googlePayScript.onload = this.createButton;
    document.head.appendChild(googlePayScript);
  },
  async created() {
    await this.getStoreConfig();
  },
  methods: {
    createButton() {
      const paymentsClient = new window.google.payments.api.PaymentsClient({ environment: 'TEST' });
      const button = paymentsClient.createButton({
        onClick: () => {},
        allowedPaymentMethods: [],
      });
      document.getElementById('adyen-google-pay').appendChild(button);
      this.googlePayLoaded = true;
    },
  },
};
</script>

<style lang="scss">
@import "./styles.scss";
</style>
