<template>
  <div class="payment-step">
    <SavedDeliveryAddress />
    <SavedShippingMethod v-if="!cart.is_virtual" />
    <Rewards v-if="rewardsEnabled" />
    <StoreCredit />
    <div class="payment-page">
      <div class="payment-form">
        <ProgressBar />
        <template v-if="cartGrandTotal">
          <ErrorMessage
            v-if="rvvupErrorMessage !== ''"
            :message="rvvupErrorMessage"
          />
          <AdyenDropIn v-if="isAdyenAvailable" />
          <BraintreeDropIn />
          <RvvupPayByBank v-if="rvvupPaymentsActive" />
          <div v-if="isPaymentMethodAvailable('checkmo')">
            <FreeMOCheckPayment
              :payment-type="'checkmo'"
              :title="getPaymentMethodTitle('checkmo')"
            />
          </div>
          <component
            :is="additionalPaymentMethod"
            v-for="additionalPaymentMethod in additionalPaymentMethods"
            :key="additionalPaymentMethod"
          />
        </template>
        <FreeMOCheckPayment
          v-else
          :payment-type="'free'"
          :title="getPaymentMethodTitle('free')
          ? getPaymentMethodTitle('free') : $t('paymentStep.freePaymentLabel')"
        />
      </div>
    </div>
  </div>
</template>
<script>
// Stores
import { mapActions, mapState } from 'pinia';
import useAdyenStore from '@/stores/PaymentStores/AdyenStore';
import useConfigStore from '@/stores/ConfigStores/ConfigStore';
import useCartStore from '@/stores/CartStore';
import usePaymentStore from '@/stores/PaymentStores/PaymentStore';
import useGtmStore from '@/stores/ConfigStores/GtmStore';

// Components
import SavedDeliveryAddress from
  '@/components/Steps/CustomerInfoPage/Addresses/SavedDeliveryAddess/SavedDeliveryAddess.vue';
import AdyenDropIn from '@/components/Steps/PaymentPage/Adyen/DropIn/DropIn.vue';
import BraintreeDropIn from '@/components/Steps/PaymentPage/Braintree/DropIn/DropIn.vue';
import SavedShippingMethod
  from '@/components/Steps/PaymentPage/SavedShippingMethod/SavedShippingMethod.vue';
import Rewards from '@/components/Core/ContentComponents/Rewards/Rewards.vue';
import StoreCredit from '@/components/Steps/PaymentPage/StoreCredit/StoreCredit.vue';
import FreeMOCheckPayment from '@/components/Steps/PaymentPage/FreeMOCheckPayment/FreeMOCheckPayment.vue';
import RvvupPayByBank from '@/components/Steps/PaymentPage/Rvvup/PayByBank/PayByBank.vue';
import ErrorMessage from '@/components/Core/ContentComponents/Messages/ErrorMessage/ErrorMessage.vue';
import ProgressBar from '@/components/Steps/GlobalComponents/ProgressBar/ProgressBar.vue';

// Helpers
import paymentMethodSelected from '@/helpers/dataLayer/paymentMethodSelectedDataLayer';

// Extensions
import paymentMethods from '@/extensions/paymentMethods';

export default {
  name: 'PaymentPage',
  components: {
    SavedDeliveryAddress,
    SavedShippingMethod,
    AdyenDropIn,
    Rewards,
    FreeMOCheckPayment,
    RvvupPayByBank,
    ErrorMessage,
    BraintreeDropIn,
    StoreCredit,
    ProgressBar,
    ...paymentMethods(),
  },
  data() {
    return {
      additionalPaymentMethods: [],
    };
  },
  computed: {
    ...mapState(useConfigStore, [
      'currencyCode',
      'storeCode',
      'rewardsEnabled',
      'rvvupPaymentsActive',
    ]),
    ...mapState(useAdyenStore, ['isAdyenAvailable']),
    ...mapState(usePaymentStore, [
      'paymentEmitter',
      'isPaymentMethodAvailable',
      'getPaymentMethodTitle',
      'rvvupErrorMessage',
    ]),
    ...mapState(useCartStore, ['cart', 'cartGrandTotal']),
  },
  async created() {
    await this.getInitialConfig();
    await this.getCart();

    await this.getRvvupConfig();

    this.additionalPaymentMethods = Object.keys(paymentMethods());

    this.trackStep({
      step: 3,
      description: 'payment',
    });

    // Track payment method selection globally.
    this.paymentEmitter.on('paymentMethodSelected', ({ type }) => {
      paymentMethodSelected(type);
    });
  },
  methods: {
    ...mapActions(useCartStore, ['getCart']),
    ...mapActions(useConfigStore, ['getInitialConfig', 'getRvvupConfig']),
    ...mapActions(useGtmStore, ['trackStep']),
    setDetailsStepActive() {
      const element = document.getElementById('progress-bar');
      element.classList.add('details-active');
    },
  },
};
</script>
<style lang="scss" scoped>
@import "./styles";
</style>
