<template>
  <div class="payment-step">
    <SavedDeliveryAddress />
    <SavedShippingMethod v-if="isItemRequiringDelivery" />
    <Rewards v-if="rewardsEnabled" />
    <StoreCredit v-if="getTotalSegment('customerbalance')" />
    <div class="payment-page">
      <div class="payment-form">
        <Recaptcha id="placeOrder" />
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
          :title="getPaymentMethodTitle('free')"
        />
      </div>
    </div>
  </div>
</template>
<script>
// Stores
import { mapActions, mapState } from 'pinia';
import useAdyenStore from '@/stores/AdyenStore';
import useConfigStore from '@/stores/ConfigStore';
import useCartStore from '@/stores/CartStore';
import usePaymentStore from '@/stores/PaymentStore';
import useGtmStore from '@/stores/GtmStore';

// Components
import SavedDeliveryAddress from
  '@/components/Steps/Addresses/SavedDeliveryAddess/SavedDeliveryAddess.vue';
import AdyenDropIn from '@/components/Adyen/DropIn/DropIn.vue';
import BraintreeDropIn from '@/components/Braintree/DropIn/DropIn.vue';
import SavedShippingMethod
  from '@/components/Steps/PaymentPage/SavedShippingMethod/SavedShippingMethod.vue';
import Rewards from '@/components/Core/Rewards/Rewards.vue';
import StoreCredit from '@/components/Core/StoreCredit/StoreCredit.vue';
import FreeMOCheckPayment from '@/components/Core/FreeMOCheckPayment/FreeMOCheckPayment.vue';
import RvvupPayByBank from '@/components/Steps/PaymentPage/Rvvup/PayByBank/PayByBank.vue';
import ErrorMessage from '@/components/Core/Messages/ErrorMessage/ErrorMessage.vue';
import Recaptcha from '@/components/Core/Recaptcha/Recaptcha.vue';

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
    Recaptcha,
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
      'adyenAuthToken',
    ]),
    ...mapState(useAdyenStore, ['isAdyenAvailable']),
    ...mapState(usePaymentStore, [
      'paymentEmitter',
      'isPaymentMethodAvailable',
      'getPaymentMethodTitle',
      'rvvupErrorMessage',
    ]),
    ...mapState(useCartStore, ['cartGrandTotal', 'getTotalSegment', 'isItemRequiringDelivery']),
  },
  async created() {
    if (!this.storeCode) {
      await this.getStoreConfig();
      await this.getCartData();
      await this.getCart();
    }

    await this.getIsAdyenAvailable();
    await this.getRvvupConfig();

    this.additionalPaymentMethods = Object.keys(paymentMethods());

    this.trackStep({
      step: 3,
      description: 'payment',
    });
  },
  methods: {
    ...mapActions(useAdyenStore, ['getIsAdyenAvailable']),
    ...mapActions(useCartStore, ['getCart', 'getCartData']),
    ...mapActions(useConfigStore, ['getStoreConfig', 'getRvvupConfig']),
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
